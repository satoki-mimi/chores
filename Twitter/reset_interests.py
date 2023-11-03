let divs = document.querySelector("main > div > div > div").children[1].children[1].children[0].children[0].children

for (let i = 1; i < divs.length; i++) {
    let input = divs[i].children[0].children[0].children[0].children[1].children[1];
    if (input.checked == true) {
        input.click();
    }
}
