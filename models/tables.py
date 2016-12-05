# Define your tables below (or better in another model file) for example
#
# >>> db.define_table('mytable', Field('myfield', 'string'))
#
# Fields can be 'string','text','password','integer','double','boolean'
#       'date','time','datetime','blob','upload', 'reference TABLENAME'
# There is an implicit 'id integer autoincrement' field
# Consult manual for more options, validators, etc.

import datetime


def get_user_email():
    return auth.user.email if auth.user else None

db.define_table('preset',
                Field('user_email', default=get_user_email()),
                Field('preset_name', 'string'),
                Field('volume', 'integer'),
                Field('wave_type', 'string'),
                Field('LPF', 'integer'),
                Field('made_public', 'boolean', default=False),
                Field('created_on', 'datetime', default=datetime.datetime.utcnow()),
                Field('shared_on', 'datetime', default=datetime.datetime.utcnow()),
                Field('subscribes', 'integer', default=0),
                )

# I don't want to display the user email by default in all forms.
db.preset.user_email.readable = db.preset.user_email.writable = False
db.preset.created_on.readable = db.preset.created_on.writable = False
db.preset.id.requires = IS_NOT_EMPTY()


# after defining tables, uncomment below to enable auditing
# auth.enable_record_versioning(db)
