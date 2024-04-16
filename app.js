const budgetForm = document.querySelector("#budget-form");
const expenseForm = document.querySelector("#expense-form");
let uniqueID = 1;
let expenses = [];
let budgetValue = 0;

const budgetEl = document.querySelector("#budget-amount");
const expenseEl = document.querySelector("#expense-amount");
const balanceEl = document.querySelector("#balance-amount");

const expenseTitleInput = document.querySelector("#expense-input");
const expenseAmountInput = document.querySelector("#amount-input");

$("#budget-form").submit((e) => {
    e.preventDefault();
    const budgetInput = $("#budget-form input")[0];
    budgetValue = budgetInput.value;
    const budgetFeedback = $(".budget-feedback")[0];
    if (!budgetValue || parseInt(budgetValue) <= 0) {
        budgetFeedback.style.display = "block";
        budgetFeedback.innerText = "Value cannot be empty of negative";
        $(budgetInput).one("focus", () => {
            budgetFeedback.style.display = "none";
        });
        return;
    }
    budgetEl.innerText = budgetValue;
    updateBalance();
    $("#budget-form")[0].reset();
});

$("#expense-form").submit((e) => {
    e.preventDefault();
    expenseTitleInputValue = expenseTitleInput.value;
    expenseAmountInputValue = parseInt(expenseAmountInput.value);
    if (expenseTitleInputValue && expenseAmountInputValue) {
        const expense = {
            expenseTitle: expenseTitleInputValue,
            expenseAmount: expenseAmountInputValue,
            id: uniqueID,
        };
        expenses.push(expense);
        updateExpenses();
        uniqueID++;
        updateBalance();
        renderExpense(expense);
    }
    $("#expense-form")[0].reset();
});

const getSumOfExpenses = () =>
    expenses.reduce((acc, curr) => acc + curr.expenseAmount, 0);

const updateBalance = () => {
    const balance = budgetValue - getSumOfExpenses(expenses);
    $(balanceEl).text(balance);
    const parent = balanceEl.parentElement;
    parent.classList = "text-uppercase mt-2 balance";
    if (balance > 0) {
        parent.classList.add("showGreen");
    } else if (balance === 0) {
        parent.classList.add("showBlack");
    } else {
        parent.classList.add("showRed");
    }
};

const updateExpenses = () => {
    $(expenseEl).text(getSumOfExpenses(expenses));
};

const createTable = () => {
    const table = $("<table></table>");
    const thead = $("<thead></thead>");
    const tbody = $("<tbody></tbody>");
    $(table).append(thead, tbody);
    $(table).addClass("table text-center");
    return table;
};

const createRow = (rowData, eltype) => {
    const row = $("<tr></tr>");
    rowData.forEach((data) => {
        const tableData = $("<" + eltype + "></" + eltype + ">");
        if (Array.isArray(data)) {
            data.forEach((set) => {
                $(tableData).append(set);
            });
        } else {
            $(tableData).text(data);
        }
        $(row).append(tableData);
    });
    return row;
};

let isTableAppended = false;
const table = createTable();

const renderExpense = (expense) => {
    const expenseContainer = $("#expenses-container");
    if (!isTableAppended) {
        expenseContainer.append(table);
        const headings = ["Expense Title", "Expense Amount", ""];
        const headingsRow = createRow(headings, "th");
        table.find("thead").append(headingsRow);
        isTableAppended = true;
    }

    const editButton = $(
        '<span class="edit-icon"><i class="fa-solid fa-pen-to-square"></i></span>'
    );

    const deleteButton = $(
        '<span class="delete-icon"><i class="fa-solid fa-trash"></i></span>'
    );

    let expenseRow = createRow(
        [
            expense.expenseTitle,
            expense.expenseAmount,
            [editButton, deleteButton],
        ],
        "td"
    );
    table.find("tbody").append(expenseRow);

    editButton.click((e) => {
        expenseRow.remove();
        $("#expense-title-input").val(expense.expenseTitle);
        $("#expense-amount-input").val(expense.expenseAmount);
        expenses = expenses.filter((el) => el.id !== expense.id);
        updateBalance();
        updateExpenses();
    });

    deleteButton.click((e) => {
        expenses = expenses.filter((el) => el.id !== expense.id);
        updateBalance();
        updateExpenses();
        expenseRow.remove();
    });
};
