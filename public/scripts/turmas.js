let currentSection = "casos"; // Define "casos" como a seção padrão

function loadSection(section) {
  currentSection = section;
  const casosSection = document.getElementById("casos-section");
  const puzzlesSection = document.getElementById("puzzles-section");

  if (section === "puzzles") {
    casosSection.style.display = "none";
    puzzlesSection.style.display = "flex";
    updateCornerImages("/assets/quebra.png");
  } else {
    casosSection.style.display = "flex";
    puzzlesSection.style.display = "none";
    updateCornerImages("/assets/pracheta.png");
  }
}

function navigate(section, subject) {
  window.location.href = `/${section}/${subject}`;
}

document.addEventListener("DOMContentLoaded", function () {
  const headerElement = document.querySelector("header-component");
  fetch("header.html")
    .then((response) => response.text())
    .then((html) => {
      headerElement.innerHTML = html;
    })
    .catch((error) => console.error("Error loading the header:", error));

  // Define "Casos Clínicos" como a seção padrão e exibe essa seção
  document.getElementById("casos-section").style.display = "flex";
  document.getElementById("puzzles-section").style.display = "none";

  const defaultSelected = document.querySelector(
    ".item:first-child .icon-wrapper"
  );
  if (defaultSelected) {
    defaultSelected.classList.add("active");
  }
});

function changeBackground(element) {
  // Reset de todos os elementos
  document.querySelectorAll(".item .icon-wrapper").forEach((el) => {
    el.classList.remove("active", "clicked");
  });

  // Muda a cor e adiciona o efeito de clique ao elemento clicado
  const iconWrapper = element.querySelector(".icon-wrapper");
  iconWrapper.classList.add("active", "clicked");

  // Remove a classe 'clicked' após um pequeno atraso para simular o clique
}

function updateCornerImages(imagePath) {
  const cornerImages = document.querySelectorAll(".corner-image img");
  cornerImages.forEach((img) => {
    const newImg = new Image();
    newImg.src = imagePath;
    newImg.classList.add("hidden", "new-image"); // Adiciona classes de transição e nova imagem
    img.parentNode.appendChild(newImg);

    setTimeout(() => {
      img.classList.add("hidden");
      newImg.classList.remove("hidden");

      // Remove a imagem antiga após a transição
      setTimeout(() => {
        img.parentNode.removeChild(img);
      }, 300);
    }, 10); // Pequeno atraso para garantir a aplicação da classe 'hidden'
  });
}

// Atualiza a função de navegação para incluir className ao navegar para a página de puzzles
function navigateToPuzzles(className) {
  window.location.href = `/puzzles?className=${encodeURIComponent(className)}`;
}

// Atualiza a chamada onclick para navegar para a página de puzzles com className
document.querySelectorAll(".grid-item").forEach((item) => {
  item.addEventListener("click", function () {
    const className = this.getAttribute("data-class-name");
    if (currentSection === "puzzles") {
      navigateToPuzzles(className);
    } else {
      window.location.href = `/casos?className=${encodeURIComponent(
        className
      )}`;
    }
  });
});
