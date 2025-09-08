// Highlight the active link
document.addEventListener("DOMContentLoaded", () => {
  const currentPath = window.location.pathname.split("/").pop();
  const sidebarLinks = document.querySelectorAll(".sidebar ul li a");

  sidebarLinks.forEach(link => {
    if(link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });

  // Mobile sidebar toggle
  const sidebar = document.querySelector(".sidebar");
  if (!sidebar) return;

  // Only add toggle button if not already present
  if (!document.querySelector(".sidebar-toggle")) {
    const toggleButton = document.createElement("button");
    toggleButton.textContent = "☰";
    toggleButton.classList.add("sidebar-toggle");
    // Insert before the sidebar for overlay effect
    sidebar.parentNode.insertBefore(toggleButton, sidebar);

    toggleButton.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
});
