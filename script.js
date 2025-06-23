document.getElementById('menu')?.addEventListener('change', function () {
    if (this.value) {
        window.location.href = this.value;
    }
});
