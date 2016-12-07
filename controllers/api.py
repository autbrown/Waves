# These are the controllers for your ajax api.


def index():
    pass


def get_user_name_from_email(email):
    """Returns a string corresponding to the user first and last names,
    given the user email."""
    u = db(db.auth_user.email == email).select().first()
    if u is None:
        return 'None'
    else:
        return ' '.join([u.first_name, u.last_name])


def get_presets():
    """This controller is used to get the posts.  Follow what we did in lecture 10, to ensure
    that the first time, we get 4 posts max, and each time the "load more" button is pressed,
    we load at most 4 more posts."""
    # Implement me!
    start_idx = int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx = int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    if request.vars.start_idx is not None:
        get_shared = True
    else:
        get_shared = False

    presets = []
    subscribed_presets = []

    logged_in = auth.user_id is not None
    current_user = auth.user.email if logged_in else None
    subscribed_to = auth.user.subscribed_to if logged_in else []
    has_more = False

    if get_shared:
        get_mine = request.vars.get_mine == 'true'
        get_subscribed = request.vars.get_subscribed == 'true'
        count = 0
        query = db.preset.made_public == True

        if auth.user is not None and not get_mine:
            query &= ~(db.preset.user_email == auth.user.email)

        if request.vars.sortby == "time":
            rows = db(query).select(db.preset.ALL, limitby=(start_idx, end_idx + 1), orderby=~db.preset.created_on)
        else:
            rows = db(query).select(db.preset.ALL, limitby=(start_idx, end_idx + 1), orderby=~db.preset.subscribes)
        for r in rows:
            if count < end_idx-start_idx:
                if auth.user is not None and auth.user.email == r.user_email:
                    mine = True
                else:
                    mine = False
                p = dict(
                    preset_name=r.preset_name,
                    subscribes=r.subscribes,
                    volume=r.volume,
                    LPF=r.LPF,
                    wave_type=r.wave_type,
                    user_name=get_user_name_from_email(r.user_email),
                    created_on=r.shared_on,
                    mine=mine,
                    id=r.id,
                )
                presets.append(p)
                count += 1
            else:
                has_more = True
    else:
        rows = db().select(db.preset.ALL, orderby=~db.preset.created_on)
        for r in rows:
            if r.user_email == current_user:
                p = dict(
                    id=r.id,
                    preset_name=r.preset_name,
                    volume=r.volume,
                    LPF=r.LPF,
                    wave_type=r.wave_type,
                    created_on=r.created_on,
                    made_public=r.made_public,
                )
                presets.append(p)
            if r.id in subscribed_to:
                s = dict(
                    id=r.id,
                    preset_name=r.preset_name,
                    volume=r.volume,
                    LPF=r.LPF,
                    wave_type=r.wave_type,
                    created_on=r.created_on,
                )
                subscribed_presets.append(s);
    return response.json(dict(
        logged_in=logged_in,
        presets=presets,
        current_user=current_user,
        subscribed=subscribed_to,
        subscribed_presets=subscribed_presets,
        current_username=get_user_name_from_email(current_user),
        has_more=has_more
    ))


# Note that we need the URL to be signed, as this changes the db.
@auth.requires_signature()
def add_preset():
    """Here you get a new post and add it.  Return what you want."""
    # Implement me!
    p_id = db.preset.insert(
        preset_name=request.vars.preset_name,
        volume=request.vars.volume,
        LPF=request.vars.LPF,
        wave_type=request.vars.wave_type
    )
    p = db.preset(p_id)
    return response.json(dict(preset=p))


@auth.requires_signature()
def delete_preset():
    """Used to delete a post."""
    # Implement me!
    db(db.preset.id == request.vars.preset_id).delete()
    return None


@auth.requires_signature()
def share_preset():
    p = db.preset(request.vars.preset_id)
    p.made_public = True
    p.shared_on = datetime.datetime.utcnow()
    p.update_record()
    response.flash = T("Successfully shared")
    return None


@auth.requires_signature()
def subscribe_preset():
    p = db.preset(request.vars.id)
    p.subscribes += 1
    p.update_record()
    auth.user.subscribed_to.append(p.id)
    db(db.auth_user.id == auth.user_id).update(subscribed_to=auth.user.subscribed_to)
    return None


@auth.requires_signature()
def unsubscribe_preset():
    p = db.preset(request.vars.id)
    p.subscribes -= 1
    p.update_record()
    auth.user.subscribed_to.remove(p.id)
    db(db.auth_user.id == auth.user_id).update(subscribed_to=auth.user.subscribed_to)
    return None
