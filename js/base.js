(function(){
    // success callback when requesting audio input stream
    navigator.webkitGetUserMedia({audio:true}, function (stream) {
        // init
        var ctx = new webkitAudioContext();
        var input = ctx.createMediaStreamSource(stream);
        var output = ctx.createGainNode();
        output.gain.value = 1;

        // the delay
        var delay = ctx.createDelayNode();
        delay.delayTime.value = 0.25;

        var delay_gain = ctx.createGainNode();
        delay_gain.gain.value = 0.75;

        delay_gain.connect(delay);
        delay.connect(delay_gain);

        // sin
        var osc = ctx.createOscillator();
        osc.type = osc.SINE;
        // osc.frequency.value = 261.625565;
        osc.frequency.value = gen_note();
        osc.noteOn(0);

        var fast_osc = ctx.createOscillator();
        fast_osc.type = osc.SINE;
        fast_osc.frequency.value = gen_note();
        fast_osc.noteOn(0);

        function gen_note(){
            //gen a note between keys 28 and 52
            var key_no = 28 + ~~(Math.random()*24);
            return Math.pow(2, ((key_no-49)/12)) * 440;
        }

        var sin_intv = setInterval(function(){
            osc.frequency.value = gen_note();
        }, 2000);

        var fast_intv =  setInterval(function(){
            fast_osc.frequency.value = gen_note();
        }, 500);

        var osc_gain = ctx.createGainNode();
        osc_gain.gain.value = 0.35;

        var osc_delay = ctx.createDelayNode();
        osc_delay.delayTime.value = 0.25;
        
        var osc_delay_gain = ctx.createGainNode();
        osc_delay_gain.gain.value = 0.75;

        osc_delay_gain.connect(osc_delay);
        osc_delay.connect(osc_delay_gain);

        osc.connect(osc_gain);
        fast_osc.connect(osc_gain);

        osc_gain.connect(osc_delay);

        // connections
        input.connect(delay);

        delay.connect(output);
        // osc_gain.connect(output);
        osc_delay.connect(output);

        output.connect(ctx.destination);
    });
})();
