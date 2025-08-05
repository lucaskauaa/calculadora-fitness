const form = document.querySelector('form');
const calculator = document.getElementById('calculator');
const nameInput = document.getElementById('nome');
const ageInput = document.getElementById('idade');
const maleInput = document.getElementById('masculino');
const femaleInput = document.getElementById('feminino');
const weightInput = document.getElementById('peso');
const heightInput = document.getElementById('altura');
const activityInput = document.getElementById('atividade');
const objectiveInput = document.getElementById('objetivo');
const submitButton = document.querySelector('button');

const styleH3 = (el) => {
    el.style.cssText = `text-align: left; margin-top: 18px`;
    return el;
};

const styleP = (el) => {
    el.style.cssText = `font-size: 18px; text-align: left; margin-top: 15px;`;
    return el;
};

const createElement = (tag, text, styleFn) => {
    const el = document.createElement(tag);
    el.textContent = text;
    styleFn(el);
    calculator.appendChild(el);
    return el;
};

function calculateMetabolismBasal(gender, weight, height, age) {
    if (gender === 'male') {
        return 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        return 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }
}

function calculateTotalSpend(basal, activity) {
    const activityFactors = {
        'leve': 1.375,
        'moderada': 1.55,
        'intensa': 1.725
    };
    return basal * activityFactors[activity];
}

function calculateCaloriesByObjective(totalSpend, objective) {
    const adjustments = {
        'ganhar peso': 300,
        'manter o peso': 0,
        'perder peso': -300
    };
    return {
        total: totalSpend + adjustments[objective],
        label: objective
    };
}

function calculateMacros(totalCalories, weight) {
    const macros = {
        protein: (totalCalories * 0.1429) / 4,
        carbs: (totalCalories * 0.5714) / 4,
        fat: (totalCalories * 0.2857) / 9
    };
    return {
        ...macros,
        proteinPerKg: macros.protein / weight,
        carbsPerKg: macros.carbs / weight,
        fatPerKg: macros.fat / weight
    };
}

function calculateIMC(weight, height) {
    return weight / (height / 100) ** 2;
}

function calculateWaterIntake(age, weight) {
    if (age < 18) return weight * 40 / 1000;
    if (age < 56) return weight * 35 / 1000;
    if (age < 65) return weight * 30 / 1000;
    return weight * 25 / 1000;
}

function calculateCreatine(weight) {
    return weight * 0.07;
}

function isFormValid({ name, age, weight, height }) {
    return name && age && weight && height;
}

submitButton.addEventListener('click', () => {
    const nameValue = nameInput.value;
    const ageValue = Number(ageInput.value);
    const weightValue = Number(weightInput.value);
    const heightValue = Number(heightInput.value);
    const activityValue = activityInput.value;
    const objectiveValue = objectiveInput.value;
    const gender = maleInput.checked ? 'male' : 'female';

    if (!isFormValid({ name: nameValue, age: ageValue, weight: weightValue, height: heightValue })) {
        alert("Preencha todos os campos!");
        nameInput.focus();
        return;
    }

    const date = new Date();
    const formattedDate = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

    const metabolismBasal = calculateMetabolismBasal(gender, weightValue, heightValue, ageValue);
    const totalSpend = calculateTotalSpend(metabolismBasal, activityValue);
    const { total: totalCalories, label: showObjective } = calculateCaloriesByObjective(totalSpend, objectiveValue);
    const macros = calculateMacros(totalCalories, weightValue);
    const imc = calculateIMC(weightValue, heightValue);
    const water = calculateWaterIntake(ageValue, weightValue);
    const creatine = calculateCreatine(weightValue);

    form.remove();

    createElement('h2', nameValue, (el) => el.style.cssText = `text-align: center; margin: 18px 0 5px 0`);
    createElement('p', formattedDate, (el) => el.style.cssText = `text-align: center; font-weight: bold;`);

    const displayData = [
        { type: 'h3', text: '🏃 Metabolismo:' },
        { type: 'p', text: `Taxa de metabolismo basal: ${metabolismBasal.toFixed(0)} kcal.` },
        { type: 'p', text: `Gasto energético total: ${totalSpend.toFixed(0)} kcal.` },
        { type: 'p', text: `Você deve ingerir ${totalCalories.toFixed(0)} kcal por dia para ${showObjective}.` },
        { type: 'h3', text: '🍗 Macronutrientes:' },
        { type: 'p', text: `Proteínas: ${macros.protein.toFixed(0)} g por dia (${macros.proteinPerKg.toFixed(1)} g/kg).` },
        { type: 'p', text: `Carboidratos: ${macros.carbs.toFixed(0)} g por dia (${macros.carbsPerKg.toFixed(1)} g/kg).` },
        { type: 'p', text: `Gorduras: ${macros.fat.toFixed(0)} g por dia (${macros.fatPerKg.toFixed(1)} g/kg).` },
        { type: 'h3', text: '💪 Outros:' },
        { type: 'p', text: `IMC: ${imc.toFixed(2)}` },
        { type: 'p', text: `Creatina: ${creatine.toFixed(1)} g por dia.` },
        { type: 'p', text: `Água: no mínimo ${water.toFixed(1)} litros por dia.` }
    ];

    displayData.forEach(item => {
        const style = item.type === 'h3' ? styleH3 : styleP;
        createElement(item.type, item.text, style);
    });

    const printButton = createElement('button', "Imprimir", (el) => el.style.cssText = `margin-top: 13px`);
    printButton.addEventListener('click', () => window.print());
});
