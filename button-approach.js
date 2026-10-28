(function () {
    var watchers = new WeakSet();

    function watch(button) {
        if (watchers.has(button)) return;
        watchers.add(button);
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                entry.target.classList.toggle('is-approaching', entry.isIntersecting);
            });
        }, {
            rootMargin: '-32% 0px -32%',
            threshold: 0
        });
        observer.observe(button);
    }

    function scan() {
        document.querySelectorAll('.project-status-featured').forEach(watch);
    }

    new MutationObserver(scan).observe(document.body, { childList: true, subtree: true });
    scan();
})();
