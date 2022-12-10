const mealsContainer = document.getElementById("meals-container");

const randomMeal = async () => {
  const z = await fetch("https://www.themealdb.com/api/json/v1/1/random.php");
  const zz = await z.json();
  const randomMeal = zz.meals[0];

  loadMeal(randomMeal);
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
  btn.addEventListener("click", () => {
    if (btn.classList.contains("active")) {
      removeLocalStorage(meal.idMeal);
      btn.classList.remove("active");
    } else {
      addLocalStorage(meal.idMeal);
      btn.classList.add("active");
    }
  });
};

removeLocalStorage = (idmeal) => {
  const data = getLocalStorage();

  const perticular = data.filter((remove) => {
    if (remove !== idmeal) {
      return remove;
    }
  });

  //   localStorage.removeItem("mealId");
  localStorage.setItem("mealId", JSON.stringify(perticular));
};

getLocalStorage = () => {
  const data = JSON.parse(localStorage.getItem("mealId"));
  return data && data.length > 0 ? data : [];
};

addLocalStorage = (idmeal) => {
  const data = getLocalStorage();
  localStorage.setItem("mealId", JSON.stringify([...data, idmeal]));
};

randomMeal();
