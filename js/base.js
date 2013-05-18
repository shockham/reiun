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
        osc.frequency.value = 261.625565;
        osc.noteOn(0);

        var sin_intv = setInterval(function(){
            if(Math.random() >= 0.5) osc.frequency.value += Math.random()*100;
            else osc.frequency.value -= Math.random()*100;
        }, 1000);

        var osc_gain = ctx.createGainNode();
        osc_gain.gain.value = 0.5;

        osc.connect(osc_gain);

        // connections
        input.connect(delay);

        delay.connect(output);
        osc_gain.connect(output);

        output.connect(ctx.destination);
    });
})();
