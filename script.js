let currentAudio = null;
let currentButton = null;
let isPlaying = false;

function createParticles() {
    const container = document.getElementById('particles');
    for(let i=0;i<50;i++){
        let p=document.createElement('div');
        p.className='particle';
        p.style.left=Math.random()*100+'%';
        p.style.top=Math.random()*100+'%';
        container.appendChild(p);
    }
}

function togglePlay(button){
    const player = button.closest('.audio-player');
    const src = player.getAttribute('data-src');
    const title = player.closest('.recitation-card').querySelector('.card-title').textContent;

    if(currentAudio && currentAudio.src===src && isPlaying){ pauseAudio(); return; }
    if(currentAudio && currentAudio.src!==src){ pauseAudio(); }

    if(!currentAudio || currentAudio.src!==src){
        currentAudio = new Audio(src);
        currentAudio.preload='metadata';
        currentAudio.addEventListener('timeupdate', ()=>{
            const progress=player.querySelector('.progress-bar');
            const time=player.querySelector('.time-display');
            let current=formatTime(currentAudio.currentTime);
            let duration=formatTime(currentAudio.duration);
            progress.style.width=(currentAudio.currentTime/currentAudio.duration)*100+'%';
            time.textContent=`${current} / ${duration}`;
        });
        currentAudio.addEventListener('ended',()=>{ pauseAudio(); resetAudioPlayer(player); });
    }

    currentAudio.play().then(()=>{
        isPlaying=true;
        button.textContent='⏸';
        currentButton=button;
        showNowPlaying(title);
    }).catch(e=>console.error(e));
}

function pauseAudio(){
    if(currentAudio){ currentAudio.pause(); isPlaying=false; if(currentButton){ currentButton.textContent='▶'; } hideNowPlaying(); }
}

function resetAudioPlayer(player){
    const btn=player.querySelector('.play-btn');
    const bar=player.querySelector('.progress-bar');
    const time=player.querySelector('.time-display');
    btn.textContent='▶'; bar.style.width='0%'; time.textContent='00:00 / 00:00';
}

function seekAudio(e,container){
    if(!currentAudio) return;
    const rect=container.getBoundingClientRect();
    const x=e.clientX-rect.left;
    currentAudio.currentTime=(x/rect.width)*currentAudio.duration;
}

function changeVolume(slider){ if(currentAudio) currentAudio.volume=slider.value; }

function formatTime(sec){ if(isNaN(sec)) return '00:00'; let m=Math.floor(sec/60); let s=Math.floor(sec%60); return `${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`; }

function showNowPlaying(title){
    const np=document.getElementById('nowPlaying');
    const txt=document.getElementById('nowPlayingText');
    txt.textContent=`جاري التشغيل: ${title}`;
    np.classList.add('active');
}

function hideNowPlaying(){ document.getElementById('nowPlaying').classList.remove('active'); }

function handleScrollAnimations(){
    document.querySelectorAll('.fade-in').forEach(e=>{
        const t=e.getBoundingClientRect().top;
        if(t<window.innerHeight-100){ e.classList.add('visible'); }
    });
}

document.querySelectorAll('.nav a').forEach(link=>link.addEventListener('click',e=>{
    e.preventDefault();
    document.querySelector(link.getAttribute('href')).scrollIntoView({behavior:'smooth'});
}));

window.addEventListener('load',()=>{
    document.getElementById('loading').style.display='none';
    createParticles();
    handleScrollAnimations();
});

window.addEventListener('scroll', handleScrollAnimations);
