// Minimal JS for business card
document.getElementById('year').textContent = new Date().getFullYear();

const mailLink = document.querySelector('.simple-card a[href^="mailto:"]');
if(mailLink && navigator.clipboard){
  mailLink.addEventListener('click', ()=>{
    const mail = mailLink.getAttribute('href').replace('mailto:','');
    navigator.clipboard.writeText(mail).catch(()=>{});
  });
}

