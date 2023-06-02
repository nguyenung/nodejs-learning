const deleteProduct = (btn) => {
    const productId = btn.parentNode.querySelector('[name=productId]').value
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value
    const productElement = btn.closest('.card')
    fetch(`/admin/product/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'csrf-token': csrf
        }
    }
    ).then(response => {
        if (response.status === 200) {
            productElement.remove()
        } else {
            alert(response.statusText)
        }
    })
    .catch(err => console.log(err))
}
