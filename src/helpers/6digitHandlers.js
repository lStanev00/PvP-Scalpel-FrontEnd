export const handleKeydown = (e, refList) => {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();
    const curentTargetIndex = Number(e.target.id);

    const prevElId = curentTargetIndex - 1;
    const nextElId = curentTargetIndex + 1;

    if (/^\d$/.test(e.key) && e.key !== 'Backspace') {
        if (curentTargetIndex < 5) {
            (refList.current[nextElId]).focus();
        } if (curentTargetIndex == 5 && refList.current[curentTargetIndex].value !== ``) return
        refList.current[curentTargetIndex].value = e.key;
    } else if (e.key == `Backspace`) {
        if (curentTargetIndex >= 1) {
            (refList.current[prevElId]).focus();
        }
        refList.current[curentTargetIndex].value = ``;
    }  else if(e.key==`Enter`) document.querySelector("body > div > main > section > button").click();

    // ToDo delete logic
    // else if (e.key == 'Delete') {
    //     if (curentTargetIndex <= 4) {
    //         refList.current[nextElId].value = ``;

    //         for (let i = curentTargetIndex; i <= 5; i++) {
    //             if (i + 1 == ((refList.current.length) - 1)) break;

    //             const curTarget = refList.current[i];
    //             const nextTarget = refList.current[i + 1]

    //             curTarget.value = nextTarget.value
    //         }
    //     }
    // }
}

export const handlePaste = (e, refList) => {
    // e.preventDefault();
    const pasteValue = e.clipboardData.getData(`text`).trim();

    if(/^\d{6}$/.test(pasteValue)) {
        for (let i = 0; i <= 5; i++) {
            refList.current[i].value = pasteValue[i];
        }
        return refList.current[5].focus();
    }
}