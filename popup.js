function showToast(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.style.opacity = 1);
  setTimeout(() => {
    toast.style.opacity = 0;
    toast.addEventListener("transitionend", () => toast.remove());
  }, 1500);
}

function loadTabs() {
  browser.tabs.query({}, (tabs) => {
    const tabList = document.getElementById("tabList");
    tabList.innerHTML = "";

    tabs.forEach((tab) => {
      const li = document.createElement("li");

      const left = document.createElement("div");
      left.className = "tab-left";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";

      const urlSpan = document.createElement("span");
      urlSpan.textContent = tab.url;
      urlSpan.title = tab.url;
      urlSpan.style.cssText = "overflow:hidden; text-overflow:ellipsis; white-space:nowrap; max-width:200px;";

      left.appendChild(checkbox);
      left.appendChild(urlSpan);

      const copyBtn = document.createElement("button");
      copyBtn.className = "copy-single";
      copyBtn.innerHTML = '<img src="icons/copy.svg" alt="Copy">';

      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(tab.url).then(() => showToast("URL copied!"));
      });

      li.appendChild(left);
      li.appendChild(copyBtn);

      tabList.appendChild(li);

      // Fade-in effect
      requestAnimationFrame(() => li.style.opacity = 1);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadTabs();

  const selectAllCheckbox = document.getElementById("selectAll");
  selectAllCheckbox.addEventListener("change", (e) => {
    document.querySelectorAll("#tabList li input").forEach(cb => cb.checked = e.target.checked);
  });

  document.getElementById("copyAll").addEventListener("click", () => {
    const urls = Array.from(document.querySelectorAll("#tabList li span"))
      .map(span => span.textContent)
      .join("\n");
    navigator.clipboard.writeText(urls).then(() => showToast("All URLs copied!"));
  });

  document.getElementById("copySelected").addEventListener("click", () => {
    const selected = Array.from(document.querySelectorAll("#tabList li input:checked"))
      .map(cb => cb.nextSibling.textContent)
      .join("\n");
    if (selected) {
      navigator.clipboard.writeText(selected).then(() => showToast("Selected URLs copied!"));
    } else {
      showToast("No tabs selected.");
    }
  });
});
