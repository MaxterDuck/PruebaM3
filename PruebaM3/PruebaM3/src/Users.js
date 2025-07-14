
// SPA Event Management Logic
// All main logic for event CRUD, enrollments, and UI rendering


/**
 * Shows the enrollments view for the current user.
 * Only displays events the user is enrolled in, with option to unenroll.
 * @param {HTMLElement} container - The container element to render into
 * @param {Object} currentUser - The current user object
 */
export function showEnrollmentsView(container, currentUser) {
/**
 * Render the enrollments view for the current user.
 * Only shows events the user is enrolled in, with option to unenroll.
 * @param {HTMLElement} container - Main app container
 * @param {Object} currentUser - Current logged-in user
 */
  container.innerHTML = `<main><div id="enrollmentsView"></div></main>`;
  showEnrollmentsViewOnly(currentUser);
}

/**
 * Renders only the events the user is enrolled in, with unenroll button.
 * @param {Object} currentUser - The current user object
 */
function showEnrollmentsViewOnly(currentUser) {
/**
 * Renders only the events the user is enrolled in, with unenroll button.
 * @param {Object} currentUser - Current logged-in user
 */
  const enrollmentsDiv = document.getElementById("enrollmentsView");
  enrollmentsDiv.style.display = "block";
  fetch("http://localhost:3000/events")
    .then(res => res.json())
    .then(events => {
      // Filter events for those the user is enrolled in
      const userEvents = events.filter(ev => Array.isArray(ev.enrolledUsers) && ev.enrolledUsers.includes(currentUser.id));
      enrollmentsDiv.innerHTML = `<h2 style="margin-bottom:1.5rem;">My Enrollments</h2>`;
      if (userEvents.length === 0) {
        enrollmentsDiv.innerHTML += `<p>No enrollments yet.</p>`;
        return;
      }
      userEvents.forEach(event => {
        enrollmentsDiv.innerHTML += `
          <div class="event-row">
            <img src="/imgs/Incognito.jpeg" alt="Event" class="event-img" />
            <div class="event-name">${event.name}</div>
            <div class="event-description">${event.description}</div>
            <div class="event-capacity">${event.capacity}</div>
            <div class="event-date">${formatDate(event.date)}</div>
            <div class="event-actions">
              <button class="event-btn unenroll-btn" style="background:#ff4d4d;color:#fff;font-weight:bold;border-radius:8px;padding:0.5rem 1.5rem;cursor:pointer;">Unenroll</button>
            </div>
          </div>
        `;
      });
      // Add click event for unenroll buttons
      Array.from(document.getElementsByClassName("unenroll-btn")).forEach((btn, idx) => {
        btn.addEventListener("click", () => {
          const event = userEvents[idx];
          unenrollEventAndRefresh(event.id, currentUser.id);
        });
      });
    });
}

/**
 * Unenrolls the user from the event and refreshes the enrollments view.
 * @param {number} eventId - The event ID
 * @param {number} userId - The user ID
 */
function unenrollEventAndRefresh(eventId, userId) {
/**
 * Unenrolls the user from the event and refreshes the enrollments view.
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 */
  fetch(`http://localhost:3000/events/${eventId}`)
    .then(res => res.json())
    .then(event => {
      if (!Array.isArray(event.enrolledUsers)) event.enrolledUsers = [];
      const idx = event.enrolledUsers.indexOf(userId);
      if (idx === -1) return;
      event.enrolledUsers.splice(idx, 1);
      // Restore event capacity
      const newCapacity = event.capacity + 1;
      fetch(`http://localhost:3000/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolledUsers: event.enrolledUsers, capacity: newCapacity })
      }).then(() => {
        showEnrollmentsViewOnly({ id: userId });
      });
    });
}

const apiUrl = "http://localhost:3000/events";
// API endpoint for events
let events = [];
// Stores all events loaded from backend

export async function initApp(container, currentUser) {
/**
 * Initializes the main app view (event list, search, admin controls).
 * @param {HTMLElement} container - Main app container
 * @param {Object} currentUser - Current logged-in user
 */
  const isAdmin = currentUser?.role === "admin";

  container.innerHTML = `
    <main>
      <div class="topbar">
        <h2>Event List</h2>
        <div class="topbar-right">
          <input type="search" id="search" class="search-input" placeholder="Search..." />
          ${isAdmin ? '<button class="add-user-btn" id="btnAdd">ADD NEW EVENT</button>' : ""}
          
        </div>
      </div>
      <div class="event-list">
        <div class="event-list-header">
          <div></div>
          <div>Name</div>
          <div>Description</div>
          <div>capacity</div>
          <div>Date</div>
          <div></div>
        </div>
        <div id="eventList"></div>
      </div>
      <div id="enrollmentsView" style="display:none;"></div>
    </main>

    <div class="form-popup" id="eventForm" style="display: none;">
      <input type="hidden" id="editId" />
      <input type="text" id="name" placeholder="Event Name" />
      <input type="text" id="description" placeholder="Description" />
      <input type="number" id="capacity" placeholder="Capacity" />
      <input type="date" id="date" />
      <button id="saveBtn">Save</button>
      <button id="cancelBtn">Cancel</button>
    </div>
  `;
  // Enrollments button event
  if (!isAdmin) {
    document.getElementById("navEnrollments").addEventListener("click", () => showEnrollments(currentUser));
  }
// Show enrollments view for user
function showEnrollments(currentUser) {
/**
 * Shows enrollments for the user (legacy, used for sidebar nav).
 * @param {Object} currentUser - Current logged-in user
 */
  const enrollmentsDiv = document.getElementById("enrollmentsView");
  enrollmentsDiv.style.display = "block";
  fetch(apiUrl)
    .then(res => res.json())
    .then(events => {
      const userEvents = events.filter(ev => Array.isArray(ev.enrolledUsers) && ev.enrolledUsers.includes(currentUser.id));
      enrollmentsDiv.innerHTML = `<h2 style="margin-bottom:1.5rem;">My Enrollments</h2>`;
      if (userEvents.length === 0) {
        enrollmentsDiv.innerHTML += `<p>No enrollments yet.</p>`;
        return;
      }
      userEvents.forEach(event => {
        enrollmentsDiv.innerHTML += `
          <div class="event-row">
            <img src="/imgs/Incognito.jpeg" alt="Event" class="event-img" />
            <div class="event-name">${event.name}</div>
            <div class="event-description">${event.description}</div>
            <div class="event-capacity">${event.capacity}</div>
            <div class="event-date">${formatDate(event.date)}</div>
            <div class="event-actions">
              <button class="event-btn unenroll-btn" style="background:#ff4d4d;color:#fff;font-weight:bold;border-radius:8px;padding:0.5rem 1.5rem;cursor:pointer;">Unenroll</button>
            </div>
          </div>
        `;
      });
      // Add unenroll logic
      Array.from(document.getElementsByClassName("unenroll-btn")).forEach((btn, idx) => {
        btn.addEventListener("click", () => {
          const event = userEvents[idx];
          unenrollEvent(event.id, currentUser.id);
        });
      });
    });

// Unenroll logic
function unenrollEvent(eventId, userId) {
/**
 * Unenrolls the user from an event and updates capacity.
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 */
  fetch(`${apiUrl}/${eventId}`)
    .then(res => res.json())
    .then(event => {
      if (!Array.isArray(event.enrolledUsers)) event.enrolledUsers = [];
      const idx = event.enrolledUsers.indexOf(userId);
      if (idx === -1) return;
      event.enrolledUsers.splice(idx, 1);
      // Restore capacity
      const newCapacity = event.capacity + 1;
      fetch(`${apiUrl}/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolledUsers: event.enrolledUsers, capacity: newCapacity })
      }).then(() => {
        // Refresca la vista de enrollments correctamente
        const enrollmentsDiv = document.getElementById("enrollmentsView");
        if (enrollmentsDiv) {
          // Vuelve a cargar solo la vista de inscripciones
          fetch(apiUrl)
            .then(res => res.json())
            .then(events => {
              const userEvents = events.filter(ev => Array.isArray(ev.enrolledUsers) && ev.enrolledUsers.includes(userId));
              enrollmentsDiv.innerHTML = `<h2 style="margin-bottom:1.5rem;">My Enrollments</h2>`;
              if (userEvents.length === 0) {
                enrollmentsDiv.innerHTML += `<p>No enrollments yet.</p>`;
                return;
              }
              userEvents.forEach(event => {
                enrollmentsDiv.innerHTML += `
                  <div class="event-row">
                    <img src="/imgs/Incognito.jpeg" alt="Event" class="event-img" />
                    <div class="event-name">${event.name}</div>
                    <div class="event-description">${event.description}</div>
                    <div class="event-capacity">${event.capacity}</div>
                    <div class="event-date">${formatDate(event.date)}</div>
                    <div class="event-actions">
                      <button class="event-btn unenroll-btn" style="background:#ff4d4d;color:#fff;font-weight:bold;border-radius:8px;padding:0.5rem 1.5rem;cursor:pointer;">Unenroll</button>
                    </div>
                  </div>
                `;
              });
              Array.from(document.getElementsByClassName("unenroll-btn")).forEach((btn, idx) => {
                btn.addEventListener("click", () => {
                  const event = userEvents[idx];
                  unenrollEvent(event.id, userId);
                });
              });
            });
        }
      });
    });
}
}

  if (isAdmin) {
    document.getElementById("btnAdd").addEventListener("click", openForm);
    document.getElementById("saveBtn").addEventListener("click", () => saveEvent(isAdmin));
    document.getElementById("cancelBtn").addEventListener("click", closeForm);
  }

  document.getElementById("search").addEventListener("input", filterEvents);
  loadEvents(isAdmin, currentUser);
}

function openForm() {
/**
 * Opens the event form popup for creating/editing events.
 */
  document.getElementById("editId").value = "";
  document.getElementById("name").value = "";
  document.getElementById("description").value = "";
  document.getElementById("capacity").value = "";
  document.getElementById("date").value = "";
  document.getElementById("eventForm").style.display = "block";
}

function closeForm() {
/**
 * Closes the event form popup.
 */
  document.getElementById("eventForm").style.display = "none";
}

function renderEvents(list = events, isAdmin = false, currentUser) {
/**
 * Renders the event list table (admin and user views).
 * @param {Array} list - Array of event objects
 * @param {boolean} isAdmin - If current user is admin
 * @param {Object} currentUser - Current logged-in user
 */
  const el = document.getElementById("eventList");
  el.innerHTML = "";

  list.forEach(event => {
    const row = document.createElement("div");
    row.className = "event-row";
    row.innerHTML = `
      <img src="/imgs/Incognito.jpeg" alt="Event" class="event-img" />
      <div class="event-name">${event.name}</div>
      <div class="event-description">${event.description}</div>
      <div class="event-capacity">${event.capacity}</div>
      <div class="event-date">${formatDate(event.date)}</div>
      <div class="event-actions"></div>
    `;
    const actionsDiv = row.querySelector(".event-actions");
    if (isAdmin) {
      const editBtn = document.createElement("button");
      editBtn.className = "event-btn edit-btn";
      editBtn.innerHTML = "<span>✏️</span>";
      editBtn.title = "Edit";
      editBtn.addEventListener("click", () => editEvent(event.id));
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "event-btn delete-btn";
      deleteBtn.innerHTML = "<span>🗑️</span>";
      deleteBtn.title = "Delete";
      deleteBtn.addEventListener("click", () => deleteEvent(event.id));
      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);
    } else {
      // User view: enroll button logic
      const enrolled = Array.isArray(event.enrolledUsers) && event.enrolledUsers.includes(currentUser?.id);
      const isFull = Array.isArray(event.enrolledUsers) && event.enrolledUsers.length >= event.capacity;
      const enrollBtn = document.createElement("button");
      enrollBtn.className = "event-btn enroll-btn";
      enrollBtn.style.background = enrolled ? "#ccc" : isFull ? "#888" : "#6e00ff";
      enrollBtn.style.color = "#fff";
      enrollBtn.style.fontWeight = "bold";
      enrollBtn.style.borderRadius = "8px";
      enrollBtn.style.padding = "0.5rem 1.5rem";
      enrollBtn.style.cursor = enrolled || isFull ? "not-allowed" : "pointer";
      enrollBtn.textContent = isFull ? "sold out" : enrolled ? "enrolled" : "enroll";
      enrollBtn.disabled = enrolled || isFull;
      if (!enrolled && !isFull) {
        enrollBtn.addEventListener("click", () => enrollEvent(event.id, currentUser.id));
      }
      actionsDiv.appendChild(enrollBtn);
    }
    el.appendChild(row);
  });
// Enroll logic
function enrollEvent(eventId, userId) {
/**
 * Enrolls the user in an event, updates capacity, and refreshes list.
 * @param {number} eventId - Event ID
 * @param {number} userId - User ID
 */
  fetch(`${apiUrl}/${eventId}`)
    .then(res => res.json())
    .then(event => {
      if (!Array.isArray(event.enrolledUsers)) event.enrolledUsers = [];
      if (event.enrolledUsers.includes(userId)) return;
      event.enrolledUsers.push(userId);
      // Update capacity: subtract 1 for each enrolled user
      const newCapacity = event.capacity > 0 ? event.capacity - 1 : 0;
      fetch(`${apiUrl}/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrolledUsers: event.enrolledUsers, capacity: newCapacity })
      }).then(() => loadEvents(false, JSON.parse(localStorage.getItem("user"))));
    });
}
}

function formatDate(dateStr) {
/**
 * Formats a date string to DD MMM YYYY (GB format).
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date
 */
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function saveEvent(isAdmin) {
/**
 * Saves a new event or updates an existing event (admin only).
 * @param {boolean} isAdmin - If current user is admin
 */
  const id = document.getElementById("editId").value;
  const name = document.getElementById("name").value.trim();
  const description = document.getElementById("description").value.trim();
  const capacity = parseInt(document.getElementById("capacity").value.trim());
  const date = document.getElementById("date").value;

  if (!name || !description || isNaN(capacity) || !date)
    return alert("Todos los campos son obligatorios");

  const newEvent = {
    name,
    description,
    capacity,
    date
  };

  if (id) {
    fetch(`${apiUrl}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: parseInt(id), ...newEvent })
    }).then(() => {
      closeForm();
      loadEvents(isAdmin);
    });
  } else {
    fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent)
    }).then(() => {
      closeForm();
      loadEvents(isAdmin);
    });
  }
}

function editEvent(id) {
/**
 * Loads event data into the form for editing (admin only).
 * @param {number} id - Event ID
 */
  fetch(`${apiUrl}/${id}`)
    .then(res => res.json())
    .then(event => {
      document.getElementById("editId").value = event.id;
      document.getElementById("name").value = event.name;
      document.getElementById("description").value = event.description;
      document.getElementById("capacity").value = event.capacity;
      document.getElementById("date").value = event.date;
      document.getElementById("eventForm").style.display = "block";
    });
}

function deleteEvent(id) {
/**
 * Deletes an event (admin only).
 * @param {number} id - Event ID
 */
  fetch(`${apiUrl}/${id}`, { method: "DELETE" }).then(() => loadEvents(true));
}

function loadEvents(isAdmin = false, currentUser) {
/**
 * Loads all events from backend and renders them.
 * @param {boolean} isAdmin - If current user is admin
 * @param {Object} currentUser - Current logged-in user
 */
  fetch(apiUrl)
    .then(res => res.json())
    .then(data => {
      events = data;
      renderEvents(events, isAdmin, currentUser);
    });
}

function filterEvents(e) {
/**
 * Filters events by name in real time as user types in search box.
 * @param {Event} e - Input event
 */
  const q = e.target.value.toLowerCase();
  const filtered = events.filter(ev => ev.name.toLowerCase().includes(q));
  const currentUser = JSON.parse(localStorage.getItem("user"));
  renderEvents(filtered, currentUser?.role === "admin", currentUser);
// ...existing code...
}
