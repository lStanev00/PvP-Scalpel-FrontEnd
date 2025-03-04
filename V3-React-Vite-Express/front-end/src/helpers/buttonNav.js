export default function buttonNav (e, liRef, setIndex, currentLiIndex) {
      switch (e.key) {
                case 'Tab':
                case 'ArrowDown':
                  e.preventDefault();
                    if (currentLiIndex === -1) {setIndex(()=>{return 0}); break}
                    if (currentLiIndex > liRef.current.length -1) setIndex(() => {
                      const newIndex = liRef.current.length -1;
                      return newIndex
                    });
                    if (!liRef.current[currentLiIndex]) break;
                    setIndex((index) => {const newIdnex = index + 1; return newIdnex})
                    break
                case 'ArrowUp':
                  e.preventDefault();
                    if (currentLiIndex == 0) break;
                    setIndex((index) => {const newIdnex = index - 1; return newIdnex})
                    break
                case 'Enter':
                    e.preventDefault();
                    liRef.current[currentLiIndex].click();
                    setIndex(() => {return -1});// Cleanup
                    break
                default:
                  // e.preventDefault();
                  
                    setIndex(() => {return -1});// Cleanup
                    document.querySelector("#searchInput").focus();
            }
        }