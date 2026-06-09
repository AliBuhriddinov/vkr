import { test, expect } from "@playwright/test";
import { login, USERS } from "./helpers";

test("a guest is asked to sign in before submitting", async ({ page }) => {
  await page.goto("/ru");
  const form = page.locator("#contacts");
  await expect(form.getByText("Войдите, чтобы оставить заявку")).toBeVisible();
});

test("a logged-in client can submit a project request", async ({ page }) => {
  await login(page, USERS.client);
  await page.waitForURL("**/cabinet");

  await page.goto("/ru");
  const form = page.locator("#contacts");
  await form
    .getByPlaceholder("Коротко опишите задачу")
    .fill("Хотим заказать новый сайт для компании.");
  await form.getByRole("button", { name: "Отправить заявку" }).click();

  await expect(page.getByText("Заявка принята")).toBeVisible();
});
