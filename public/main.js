const update = document.querySelector('#update-button')

update.addEventListener('click', _ => {
    fetch('/quotes', {
        method: 'put',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: 'KARL MACARIO',
            quote: 'LAS PINAS CITY HEALTH PRACTICE SYSTEM'
        })
    })
    .then(res => {
        if (res.ok) return res.json()
        console.log("riun")
    })
    .then(response => {
        window.location.reload()
        console.log("reload")
    })
})
