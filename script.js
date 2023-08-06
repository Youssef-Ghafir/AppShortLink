let box = document.querySelector('.box .bx');
function VerifyLink(link) {
    let regex = /((?:(?:http?|ftp)[s]*:\/\/)?[a-z0-9-%\/\&=?\.]+\.[a-z]{2,4}\/?([^\s<>\#%"\,\{\}\\|\\\^\[\]`]+)?)/gi
    if(regex.test(link)) {
        return true
    }
    return false;
}
async function shortLink(url) {
    let short_link = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
    if(short_link.ok) {
        return short_link = short_link.json()
    }else {
        return false
    }
}
let result = document.querySelector('.result');
function GetItems() {
    if(window.sessionStorage.getItem('Items')) {
        let storage = JSON.parse(window.sessionStorage.getItem('Items'));
        for (let i = 0; i < storage.length; i++) {
           result.innerHTML += `
           <div class="bx">
           <p>${storage[i].old}</p>
           <div class="re">
               <p>${storage[i].new}</p>
               <button class="copy">copy</button>
           </div>
           `
        }
    }
}
GetItems();
function Addremove(el,name,etat) {
    if(etat) {
        el.classList.remove(name);
    }else {
        el.classList.add(name);
    }
}
box.children[1].addEventListener('click',_ => {
    if(VerifyLink(box.children[0].children[0].value)) {
        Addremove(box.parentElement,'active',true);
        let shor_l =''
        if(box.children[0].children[0].value.length > 40) {
            shor_l = box.children[0].children[0].value.slice(0,30) + '....'
        }else {
            shor_l = box.children[0].children[0].value
        }
        shortLink(box.children[0].children[0].value).then(
            e => {
                if(e.ok){
                    SetItems(shor_l,e.result.full_short_link);
                    result.innerHTML += `
                <div class="bx">
                <p>${shor_l}</p>
                <div class="re">
                    <p>${e.result.full_short_link}</p>
                    <button class="copy">copy</button>
                </div>
                `
                box.children[0].value = '';
                }
            }
        )
    }else {
        Addremove(box.parentElement,'active',false);
    }
})
result.addEventListener('click',e => {
    if(e.target.classList.contains('copy')){
        document.getElementById('copy').value = e.target.previousElementSibling.textContent
        document.getElementById('copy').select();
        if(document.execCommand('copy')) {
            e.target.textContent = 'Copied'
            e.target.style.backgroundColor = '#3B3058 '
            e.target.classList.add('active')
        }else {
            console.log('An error')
        }
    }
})
document.querySelector('.paste').addEventListener('click',_ => {
    paste().then(e => {
        box.children[0].children[0].value = e;    
    });
})
async function paste() {
    value = await navigator.clipboard.readText();
    return value;
}
function SetItems(oldUrl,newUrl) {
    if(window.sessionStorage.getItem('Items')) {
        let storage = JSON.parse(window.sessionStorage.getItem('Items'));
        let new_Item = {
            old : oldUrl,
            new : newUrl
        }
        storage.push(new_Item);
        window.sessionStorage.setItem('Items',JSON.stringify(storage));
    }else {
        let storage = [
            {
            old : oldUrl,
            new : newUrl
            }
        ]
        window.sessionStorage.setItem('Items',JSON.stringify(storage));
    }
}
