/* reader.js — tiện ích đọc sách: progress bar, đánh dấu đã đọc, checkbox lưu trạng thái */
(function () {
  var KEY_READ = "gtk-read";      // {slug: true}
  var KEY_TASK = "gtk-tasks";     // {taskKey: true}
  var slug = document.body.dataset.slug || "";

  function load(key) { try { return JSON.parse(localStorage.getItem(key)) || {}; } catch (e) { return {}; } }
  function save(key, obj) { try { localStorage.setItem(key, JSON.stringify(obj)); } catch (e) {} }

  /* --- Thanh tiến độ cuộn --- */
  var bar = document.getElementById("progress");
  if (bar) {
    var onScroll = function () {
      var h = document.documentElement;
      var max = h.scrollHeight - h.clientHeight;
      bar.style.width = (max > 0 ? (h.scrollTop / max) * 100 : 0) + "%";
    };
    document.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* --- Sidebar mobile --- */
  var toggle = document.getElementById("nav-toggle");
  var sidebar = document.querySelector(".sidebar");
  if (toggle && sidebar) {
    toggle.addEventListener("click", function () { sidebar.classList.toggle("open"); });
    document.addEventListener("click", function (e) {
      if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && e.target !== toggle) {
        sidebar.classList.remove("open");
      }
    });
  }

  /* --- Trạng thái "đã đọc" trên sidebar + card trang chủ --- */
  var readMap = load(KEY_READ);
  document.querySelectorAll("[data-nav-slug]").forEach(function (el) {
    if (readMap[el.dataset.navSlug]) el.classList.add("is-done");
  });

  /* --- Nút "đánh dấu đã đọc" cuối chương --- */
  var btn = document.getElementById("mark-read");
  function renderBtn() {
    if (!btn) return;
    var done = !!readMap[slug];
    btn.classList.toggle("done", done);
    btn.textContent = done ? "✓ Đã đọc xong chương này — bấm để bỏ đánh dấu" : "Đánh dấu đã đọc xong chương này";
  }
  if (btn) {
    btn.addEventListener("click", function () {
      readMap = load(KEY_READ);
      if (readMap[slug]) delete readMap[slug]; else readMap[slug] = true;
      save(KEY_READ, readMap);
      renderBtn();
      var nav = document.querySelector('[data-nav-slug="' + slug + '"]');
      if (nav) nav.classList.toggle("is-done", !!readMap[slug]);
    });
    renderBtn();
  }

  /* --- Checkbox checklist lưu localStorage --- */
  var taskMap = load(KEY_TASK);
  document.querySelectorAll('li.task input[type="checkbox"]').forEach(function (cb) {
    var k = cb.dataset.key;
    if (taskMap[k]) cb.checked = true;
    cb.addEventListener("change", function () {
      taskMap = load(KEY_TASK);
      if (cb.checked) taskMap[k] = true; else delete taskMap[k];
      save(KEY_TASK, taskMap);
    });
  });
})();
