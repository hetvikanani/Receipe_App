const mealsContainer = document.getElementById("meals-container");

const favMeal = document.getElementById("fav-meals");

const mealPopup = document.getElementById("meal-popup");
const closePopup = document.getElementById("close-popup");
const mealInfoEl = document.getElementById("meal-info");

const randomMeal = async () => {
  const z = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const zz = await z.json();
  const randomMeal = zz.meals[0];

  loadMeal(randomMeal);
};

const mealById = async (id) => {
  const z = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + id
  );
  const zz = await z.json();
  const randomMeal = zz.meals[0];

  return randomMeal;
};

const mealSearch = async (val) => {
  const z = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + val
  );
  const zz = await z.json();
  const searchApi = zz.meals;
  return searchApi;
};

const loadMeal = (meal) => {
  mealsContainer.innerHTML = `
    <div class="meal">
    <div class="meal-header">
      <span class="random">Random Receipe</span>

      <img
        src="${meal.strMealThumb}"
      />
    </div>
    <div class="meal-body">
      <h4>${meal.strMeal}</h4>
      <button class="fav-btn">
        <i class="fa fa-heart"></i>
      </button>
    </div>
  </div>`;

  const btn = document.querySelector(".meal-body .fav-btn");
  btn.addEventListener("click", async () => {
    if (btn.classList.contains("active")) {
      removeLocalStorage(meal.idMeal);
      btn.classList.remove("active");
      fetchFavMeal();
    } else {
      addLocalStorage(meal.idMeal);
      const z = await mealById(meal.idMeal);
      addMeal(z);
      btn.classList.add("active");
    }
    // fetchFavMeal();
  });
  mealsContainer.addEventListener("click", () => {
    showMealInfo(meal);
  });
};

const removeLocalStorage = (idmeal) => {
  const data = getLocalStorage();

  const perticular = data.filter((remove) => {
    if (remove !== idmeal) {
      return remove;
    }
  });

  //   localStorage.removeItem("mealId");
  localStorage.setItem("mealId", JSON.stringify(perticular));
};

const getLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem("mealId"));
  return data && data.length > 0 ? data : [];
};

const addLocalStorage = (idmeal) => {
  const data = getLocalStorage();
  localStorage.setItem("mealId", JSON.stringify([...data, idmeal]));
};

const fetchFavMeal = async () => {
  favMeal.innerHTML = "";
  const mealIds = getLocalStorage();
  for (let i = 0; i < mealIds.length; i++) {
    const mealId = mealIds[i];
    meal = await mealById(mealId);
    addMeal(meal);
  }
};

const addMeal = (meal) => {
  const li = document.createElement("li");
  li.innerHTML = `<img
  src="${meal.strMealThumb}"
/>
<span>${meal.strMeal}</span>
<button class="clear" id=${meal.idMeal}><i class="fa fa-window-close"></i></button>
`;

  li.querySelector(".clear").addEventListener("click", () => {
    removeLocalStorage(meal.idMeal);
    fetchFavMeal();
  });
  li.addEventListener("click", () => {
    showMealInfo(meal);
  });
  favMeal.append(li);
};

randomMeal();
fetchFavMeal();

const search = document.getElementById("search");
const searchInput = document.getElementById("search-input");

search.addEventListener("click", async () => {
  mealsContainer.innerHTML = "";

  const sInput = searchInput.value;
  const sItem = await mealSearch(sInput);

  if (sItem) {
    sItem.forEach((element) => {
      loadMeal(element);
      //   addMeal(element);
    });
  }
});

const showMealInfo = (mealData) => {
  mealInfoEl.innerHTML = "";
  const mealEl = document.createElement("div");
  const indigrants = [];
  for (let i = 0; i <= 20; i++) {
    if (mealData[`strIngredient` + i]) {
      indigrants.push(`${mealData[`strIngredient` + i]}`);
    } else {
      break;
    }
  }
  mealEl.innerHTML = `
  <h1>${mealData.strMeal}</h1>
  <img src="${mealData.strMealThumb}" />
  <p>${mealData.strInstructions}</p>
  <h3>Indigrants:</h3>
  <ul>${indigrants.map((i) => `<li>${i}</li>`).join("")}</ul>
  `;

  mealInfoEl.appendChild(mealEl);
  mealPopup.classList.remove("hidden");
};

closePopup.addEventListener("click", () => {
  mealPopup.classList.add("hidden");
});
