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

    self.get_presets = function() {
        $.getJSON(get_url, function(data) {
            self.vue.presets = data.presets;
            self.vue.subscribed_presets = data.subscribed_presets;
            self.vue.logged_in = data.logged_in;
            self.vue.current_user = data.current_user;
            self.vue.current_username = data.current_username;
        });
    };

    self.add_preset_button = function() {
        if(self.vue.logged_in) {
            self.vue.is_adding = !self.vue.is_adding;

        }
    };

    self.add_preset = function() {
        var check = true;
        var input = $('#preset_name_input').val();
        if (input == '' || input.length>30) {
            check = false;
        }
        self.vue.preset_name = input;
        console.log($("input[name=wave_type]:checked").val());
        console.log($('.knob1').val());
        $('#preset_name_input').val('');
        if (check){
            $.post(add_url,
                {
                    preset_name: self.vue.preset_name,
                    volume: $('.knob1').val(),
                    LPF: $('.knob2').val(),
                    wave_type: $("input[name=wave_type]:checked").val(),
                },
                function(data) {
                    self.vue.presets.unshift(data.preset);
                }
            );
            self.vue.is_adding = false;
        }
        else {
            $('#preset_name_input').effect( "shake" );
        }
    };

    self.set_preset = function(preset_idx) {
        $('.knob1').val(self.vue.presets[preset_idx].volume).trigger('change');
        $('.knob2').val(self.vue.presets[preset_idx].LPF).trigger('change');
        $('input:radio[name=wave_type]').val([self.vue.presets[preset_idx].wave_type]);
    };

    self.set_subscribed_preset = function(preset_idx) {
        $('.knob1').val(self.vue.subscribed_presets[preset_idx].volume).trigger('change');
        $('.knob2').val(self.vue.subscribed_presets[preset_idx].LPF).trigger('change');
        $('input:radio[name=wave_type]').val([self.vue.subscribed_presets[preset_idx].wave_type]);
    }

    self.delete_preset = function(preset_idx) {
        $.post(del_url,
            {preset_id: self.vue.presets[preset_idx].id},
            function () {
                self.vue.presets.splice(preset_idx, 1);
            }
        )
    };

    self.share_preset = function(preset_idx) {
        self.vue.presets[preset_idx].made_public = true;
        if (confirm("Are you sure you want to share your preset?")) {
            $.post(share_url,
                {preset_id: self.vue.presets[preset_idx].id},
                function() {

                }
            );
        }

    };

    self.no_subscriptions = function() {
        return self.vue.subscribed_presets.length == 0;
    };

    self.unsubscribe_preset = function(index) {
        if (self.vue.logged_in) {
            $.post(unsubscribe_url,
                {
                    id: self.vue.subscribed_presets[index].id,
                },
                function() {
                    self.vue.subscribed_presets.splice(index, 1);
                }
            );
        }
    };

    self.is_shared = function(index) {
        return self.vue.presets[index].made_public;
    };

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            current_user: null,
            current_username: null,
            is_adding: false,
            presets: [],
            subscribed_presets: [],
            logged_in: false,
            preset_name: null,
        },
        methods: {
            add_preset_button: self.add_preset_button,
            add_preset: self.add_preset,
            is_user: self.is_user,
            set_preset: self.set_preset,
            set_subscribed_preset: self.set_subscribed_preset,
            delete_preset: self.delete_preset,
            share_preset: self.share_preset,
            no_subscriptions: self.no_subscriptions,
            unsubscribe_preset: self.unsubscribe_preset,
            is_shared: self.is_shared,
        }
    });

    self.get_presets();
    $("#vue-div").show();

    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
