window.onload = function () {
    const file = document.getElementById("thefile") as HTMLInputElement;
    const audio = document.getElementById("audio") as HTMLAudioElement;
    const bars = document.getElementById("bars") as HTMLElement;
    const maxElement = document.getElementById("max") as HTMLElement;

    file.onchange = function () {
       if(!file.files) return;

       const files = file.files;
       audio.src = URL.createObjectURL(files[0]);
       audio.load();
       audio.play();
   
       const context = new window.AudioContext();
       const src = context.createMediaElementSource(audio);
       const analyser = context.createAnalyser();
       src.connect(analyser);

       analyser.connect(context.destination);
       /**
        * La propriété fftSize de l'objet AnalyserNode est un nombre entier non signé qui représente 
        * la taille de la FFT (transfomation de Fourier rapide) à utiliser pour déterminer le domaine fréquentiel.
        * La valeur de la propriété fftSize property's doit être une puissance de 2 non nulle située 
        * dans l'intervalle compris entre 32 et 32768 ; sa valeur par défaut est 2048.
        * Dans notre cas cela va déterminé le nombre de barres à afficher
        * p.ex une valeur de 32 va afficher 16 barres
        */
       analyser.fftSize = 256;
       const bufferLength = analyser.frequencyBinCount;
       const dataArray = new Uint8Array(bufferLength);

       for (let i = 0; i < bufferLength; i++) {
            const bar = document.createElement("div");
            bar.id = `bar-${i}`;
            bar.className = "bar";
            bars!.appendChild(bar);
        }
        function renderFrame() {
            requestAnimationFrame(renderFrame);
            analyser.getByteFrequencyData(dataArray);
            let max = 0;
            for (let i = 0; i < dataArray.length; i++) {
                const height = dataArray[i];
                if(height > max){
                    max = height;
                }
                const bar = document.getElementById(`bar-${i}`);
                if(!bar){
                    return
                }
                const r = height + 25 * (i / bufferLength);
                const g = 250 * (i / bufferLength);
                const b = 50;
                const rgb = `rgb(${r},${g},${b})`;
                bar.style.backgroundColor = rgb;
                bar.style.height = `${height}px`;
            }
            maxElement!.innerText = `${max}`;

        }
        renderFrame()


    }

}