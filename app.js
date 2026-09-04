const API_URL =
  "https://script.google.com/macros/s/AKfycbyd5V4vSH32VljuzgtDInmBzs8uUVfNG978aZSAyFM1c4iqogILKgq1mpB8ccmjxPUi/exec";


let homeworkData = [];


/* CLOCK */

function updateClock() {

  const now = new Date();
  const hour = now.getHours();

  let greeting;

  if (hour >= 5 && hour < 12) {
    greeting = "สวัสดีตอนเช้า ☀️";
  }
  else if (hour >= 12 && hour < 17) {
    greeting = "สวัสดีตอนบ่าย 🌤️";
  }
  else if (hour >= 17 && hour < 21) {
    greeting = "สวัสดีตอนเย็น 🌆";
  }
  else {
    greeting = "สวัสดีตอนกลางคืน 🌙";
  }

  document.getElementById("greeting")
    .textContent =
    greeting + " ภูมินทร์";


  const date =
    now.toLocaleDateString(
      "th-TH",
      {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }
    );


  const time =
    now.toLocaleTimeString(
      "th-TH",
      {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    );


  document.getElementById("datetime")
    .textContent =
    date + " • " + time;
}


setInterval(updateClock,1000);
updateClock();


/* PAGE */

function showPage(name, button) {

  document
    .querySelectorAll(".page")
    .forEach(p =>
      p.classList.remove("active")
    );

  const page =
    document.getElementById(name);

  if (page) {
    page.classList.add("active");
  }


  if (button) {

    const parent =
      button.parentElement;

    parent
      .querySelectorAll("button")
      .forEach(b =>
        b.classList.remove("active")
      );

    button.classList.add("active");
  }
}


/* LOAD */

async function loadHomework() {

  try {

    const response =
      await fetch(
        API_URL + "?action=get"
      );

    homeworkData =
      await response.json();

    render();

  }
  catch(error) {

    console.error(error);

    document.getElementById(
      "homeworkList"
    ).innerHTML = `
      <div class="empty">
        <div>!</div>
        <h2>โหลดข้อมูลไม่ได้</h2>
        <p>กรุณาตรวจสอบการเชื่อมต่อ</p>
      </div>
    `;
  }
}


/* RENDER */

function render() {

  const total =
    homeworkData.length;


  const completed =
    homeworkData.filter(
      x => x.status === "เสร็จแล้ว"
    ).length;


  const unfinished =
    total - completed;


  document.getElementById("total")
    .textContent = total;


  document.getElementById("completed")
    .textContent = completed;


  document.getElementById("unfinished")
    .textContent = unfinished;


  const percent =
    total === 0
      ? 0
      : Math.round(
          completed / total * 100
        );


  document.getElementById(
    "percentage"
  ).textContent =
    percent + "%";


  document.getElementById(
    "progressBar"
  ).style.width =
    percent + "%";


  const html =
    homeworkData
      .map(createCard)
      .join("");


  if (total === 0) {

    const empty = `
      <div class="empty">
        <div>□</div>
        <h2>ยังไม่มีการบ้าน</h2>
        <p>กดปุ่ม ＋ เพื่อเพิ่มการบ้าน</p>
      </div>
    `;

    document.getElementById(
      "homeworkList"
    ).innerHTML = empty;

    document.getElementById(
      "allHomework"
    ).innerHTML = empty;

    return;
  }


  document.getElementById(
    "homeworkList"
  ).innerHTML = html;


  document.getElementById(
    "allHomework"
  ).innerHTML = html;
}


/* CARD */

function createCard(hw) {

  const done =
    hw.status === "เสร็จแล้ว";


  return `
    <div class="homework-card ${done ? "done" : ""}">

      <div class="hw-left">

        <div class="hw-icon">
          ✓
        </div>

        <div>

          <div class="hw-name">
            ${escapeHtml(hw.homework)}
          </div>

          <div class="hw-subject">
            ${escapeHtml(hw.subject)}
          </div>

        </div>

      </div>


      <div class="hw-right">

        <div class="hw-date">
          ส่ง ${escapeHtml(hw.dueDate || "-")}
        </div>

        ${
          done
          ? `
            <span class="complete-btn">
              ✓ เสร็จแล้ว
            </span>
          `
          : `
            <button
              class="complete-btn"
              onclick="completeHomework('${hw.id}')">
              ✓ เสร็จแล้ว
            </button>
          `
        }

      </div>

    </div>
  `;
}


/* MODAL */

function openModal() {

  document.getElementById("modal")
    .classList.add("show");
}


function closeModal() {

  document.getElementById("modal")
    .classList.remove("show");
}


/* ADD */

async function saveHomework() {

  const subject =
    document.getElementById("subject")
      .value.trim();

  const homework =
    document.getElementById("homework")
      .value.trim();

  const dueDate =
    document.getElementById("dueDate")
      .value;

  const dueTime =
    document.getElementById("dueTime")
      .value;

  const priority =
    document.getElementById("priority")
      .value;


  if (!subject || !homework) {

    alert(
      "กรุณากรอกวิชาและชื่อการบ้าน"
    );

    return;
  }


  /*
    ตอนนี้การอ่านข้อมูลทำงานแล้ว
    ขั้นต่อไปจะเชื่อมการเพิ่มข้อมูล
    เข้ากับ Google Sheets
  */

  alert(
    "กำลังเพิ่มระบบบันทึกการบ้านลง Google Sheets"
  );

  closeModal();
}


/* COMPLETE */

async function completeHomework(id) {

  alert(
    "ระบบเปลี่ยนสถานะจะเปิดในขั้นถัดไป"
  );
}


/* NAME */

function saveName() {

  const name =
    document.getElementById(
      "username"
    ).value;

  localStorage.setItem(
    "studyflow_name",
    name
  );
}


/* ESCAPE */

function escapeHtml(value) {

  return String(value ?? "")
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}


/* START */

loadHomework();
