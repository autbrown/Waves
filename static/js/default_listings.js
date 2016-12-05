// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    self.is_user = function(email1) {
        return email1 == self.vue.current_user;
    };

    function get_presets_url(start_idx, end_idx) {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return get_url + "?" + $.param(pp);
    };

    self.get_presets = function(start_idx, end_idx) {
        $.getJSON(get_presets_url(start_idx, end_idx), function(data) {
            self.vue.presets = data.presets;
            self.vue.logged_in = data.logged_in;
            self.vue.current_user = data.current_user;
            self.vue.current_username = data.current_username;
            self.vue.has_more = data.has_more;
            self.vue.subscribed = data.subscribed;
        });
    };

    self.subscribe_button = function(index) {
        if (self.vue.logged_in) {
            $.post(subscribe_url,
                {
                    id: self.vue.presets[index].id,
                },
                function() {
                    self.vue.subscribed.unshift(self.vue.presets[index].id);
                    self.vue.presets[index].subscribes++;
                }
            );
        }
    };

    self.unsubscribe_button = function(index) {
        if (self.vue.logged_in) {
            $.post(unsubscribe_url,
                {
                    id: self.vue.presets[index].id,
                },
                function() {
                    var preset_idx = self.vue.subscribed.indexOf(self.vue.presets[index].id);
                    self.vue.subscribed.splice(preset_idx, 1);
                    self.vue.presets[index].subscribes--;
                }
            );
        }
    };

    self.is_subscribed = function(index) {
        for (i in self.vue.subscribed) {
            if (self.vue.presets[index].id == self.vue.subscribed[i]) {
                return true;
            }
        }
        return false;
    };

    self.is_mine = function(index) {
        return self.vue.presets[index].mine;
    };

    self.is_enabled = function(index) {
        return !self.vue.is_mine(index) && !self.vue.is_subscribed(index);
    };

    self.has_less = function() {
        return start_idx > 0;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            presets: [],
            current_user: null,
            current_username: null,
            subscribed: [],
            logged_in: false,
            has_more: false,
        },
        methods: {
            subscribe_button: self.subscribe_button,
            unsubscribe_button: self.unsubscribe_button,
            is_enabled: self.is_enabled,
            is_mine: self.is_mine,
            is_subscribed: self.is_subscribed,
            has_less: self.has_less,
        }
    });

    self.get_presets(start_idx,end_idx);
    $("#vue-div").show();


    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
