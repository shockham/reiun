(function(){
    // success callback when requesting audio input stream
    navigator.webkitGetUserMedia({audio:true}, function (stream) {
        // init
        var ctx = new webkitAudioContext();
        var input = ctx.createMediaStreamSource(stream);
        var output = ctx.createGainNode();
        output.gain.value = 1;

        create_delay(input).connect(output);
        create_synth(500, true).connect(output);
        create_synth(2000, false).connect(output);

        output.connect(ctx.destination);

        // the delay
        function create_delay(inp){
            var delay = ctx.createDelayNode();
            delay.delayTime.value = 0.25;

            var delay_gain = ctx.createGainNode();
            delay_gain.gain.value = 0.75;

            delay_gain.connect(delay);
            delay.connect(delay_gain);

            inp.connect(delay);

            return delay;
        }

        function gen_note(){
            //gen a note between keys 28 and 52
            var key_no = 28 + ~~(Math.random()*24);
            return Math.pow(2, ((key_no-49)/12)) * 440;
        }

        function create_synth(speed, staccato){
            // sin
            var osc = ctx.createOscillator();
            osc.type = osc.SINE;
            // osc.frequency.value = 261.625565;
            osc.frequency.value = gen_note();
            osc.noteOn(0);

            var sin_intv = setInterval(function(){
                osc.frequency.value = gen_note();
            }, speed);

            var osc_gain = ctx.createGainNode();
            osc_gain.gain.value = 0.35;

            if(staccato){
                setInterval(function(){
                    if(osc_gain.gain.value === 0) osc_gain.gain.value = 0.35;
                    else osc_gain.gain.value = 0;
                }, speed/2);
            }

            osc.connect(osc_gain);

            return create_delay(osc_gain);
        }
    });
})();
