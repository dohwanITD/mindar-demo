AFRAME.registerComponent('step-ctrl', {
    schema: {
    },
    init() {
        // Guide Panel ----------
        const guideDiv = document.getElementById('guidePanel')
        
        const exampleTarget = document.querySelector('#example-target');

        exampleTarget.addEventListener("targetFound", event => {
            console.log("target found");
            guideDiv.style.display = 'none';
        });
    }
})