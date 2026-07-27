import { expect, test, type Page } from "@playwright/test";

/** Correct option indices for the first fundamentals lesson quiz */
const FIRST_LESSON_CORRECT = [0, 1, 1, 0, 2];

async function gotoPath(page: Page, path: string) {
  await page.goto(path, { waitUntil: "domcontentloaded" });
}

async function completeFirstLessonQuiz(page: Page) {
  const quizHeading = page.getByRole("heading", { name: "Проверьте себя" });
  await expect(quizHeading).toBeVisible({ timeout: 30_000 });

  const groups = page.getByRole("radiogroup");
  await expect(groups).toHaveCount(FIRST_LESSON_CORRECT.length, {
    timeout: 30_000,
  });
  await groups.first().scrollIntoViewIfNeeded();

  for (let i = 0; i < FIRST_LESSON_CORRECT.length; i += 1) {
    const radios = groups.nth(i).getByRole("radio");
    await radios.nth(FIRST_LESSON_CORRECT[i]).click();
  }

  await page.getByRole("button", { name: "Проверить ответы" }).click();
  await expect(page.getByText("· тест сдан")).toBeVisible();
  await page.getByRole("button", { name: /Отметить как прочитанный/i }).click();
  await expect(page.getByText(/Урок завершён/i)).toBeVisible();
}

test.describe("smoke + unlock", () => {
  test("landing opens and leads into the academy", async ({ page }) => {
    await gotoPath(page, "/");
    await expect(
      page.getByRole("heading", { name: "Investment Academy" })
    ).toBeVisible();
    await page.getByRole("link", { name: /Начать обучение/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(
      page.getByRole("heading", { name: /Учитесь инвестировать спокойно/i })
    ).toBeVisible();
  });

  test("first course lessons are visible; later course content stays locked", async ({
    page,
  }) => {
    await gotoPath(page, "/courses");
    await expect(page.getByRole("heading", { name: "Курсы" })).toBeVisible();

    await page
      .getByRole("link", { name: /Основы мышления инвестора/i })
      .first()
      .click();
    await expect(page).toHaveURL(/\/courses\/investing-fundamentals/);
    await expect(page.getByRole("heading", { name: "Программа" })).toBeVisible();

    await expect(
      page.getByRole("link", { name: /Что такое инвестирование/i })
    ).toBeVisible();

    await expect(
      page.getByText(/Сначала завершите урок/i).first()
    ).toBeVisible();

    await gotoPath(page, "/courses/stocks-and-bonds");
    await expect(page.getByText(/Закрыт/i).first()).toBeVisible();
    await expect(
      page.getByText(/Содержание откроется после предыдущего курса/i).first()
    ).toBeVisible();

    await gotoPath(page, "/courses/stocks-and-bonds/lessons/akcii");
    await expect(
      page.getByRole("heading", { name: /Урок пока закрыт/i })
    ).toBeVisible();
  });

  test("completing a lesson unlocks the next one", async ({ page }) => {
    await gotoPath(
      page,
      "/courses/investing-fundamentals/lessons/chto-takoe-investirovanie"
    );
    await expect(
      page.getByRole("heading", { name: /Что такое инвестирование/i })
    ).toBeVisible({ timeout: 30_000 });
    // MDX hydrates client-only; wait for quiz before interacting
    await expect(
      page.getByRole("heading", { name: "Проверьте себя" })
    ).toBeVisible({ timeout: 30_000 });

    await completeFirstLessonQuiz(page);

    await gotoPath(page, "/courses/investing-fundamentals");
    await expect(
      page.getByRole("link", { name: /Инфляция и покупательная способность/i })
    ).toBeVisible();

    await page
      .getByRole("link", { name: /Инфляция и покупательная способность/i })
      .click();
    await expect(page).toHaveURL(
      /\/courses\/investing-fundamentals\/lessons\/inflyaciya/
    );
    await expect(
      page.getByRole("button", { name: /Отметить как прочитанный/i })
    ).toBeVisible({ timeout: 30_000 });
    await expect(
      page.getByRole("heading", { name: /Урок пока закрыт/i })
    ).toHaveCount(0);
  });
});

test.describe("responsive nav", () => {
  test("mobile nav exposes progress", async ({ page, isMobile }) => {
    test.skip(!isMobile, "mobile project only");
    await gotoPath(page, "/dashboard");
    const nav = page.getByRole("navigation", { name: "Мобильная навигация" });
    await expect(nav.getByRole("link", { name: "Прогресс" })).toBeVisible();
    await nav.getByRole("link", { name: "Прогресс" }).click();
    await expect(page).toHaveURL(/\/progress/);
  });

  test("tablet shows side nav or content shell", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "tablet", "tablet project only");
    await gotoPath(page, "/dashboard");
    await expect(
      page.getByRole("heading", { name: /Учитесь инвестировать спокойно/i })
    ).toBeVisible();
    const sideNav = page.getByRole("navigation", { name: "Основная навигация" });
    const mobileNav = page.getByRole("navigation", {
      name: "Мобильная навигация",
    });
    const hasSide = await sideNav.isVisible().catch(() => false);
    const hasMobile = await mobileNav.isVisible().catch(() => false);
    expect(hasSide || hasMobile).toBeTruthy();
  });
});

test.describe("guest utilities", () => {
  test("settings expose theme and progress backup controls", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop smoke only");
    await gotoPath(page, "/settings");
    await expect(page.getByRole("heading", { name: "Ещё" })).toBeVisible();
    await expect(
      page.getByRole("radiogroup", { name: "Тема оформления" })
    ).toBeVisible();
    // Wait for ThemeProvider client hydration (data-theme is set in useLayoutEffect)
    await expect(page.locator("html")).toHaveAttribute("data-theme", /.+/);
    await page.locator('[data-theme-option="dark"]').click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expect(page.locator('[data-theme-option="dark"]')).toHaveAttribute(
      "aria-checked",
      "true"
    );
    await expect(
      page.getByRole("button", { name: /Экспорт/i })
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /Сбросить/i })
    ).toBeVisible();
  });

  test("catalog search and tags filter courses", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "desktop smoke only");
    await gotoPath(page, "/courses");
    await expect(page.getByRole("heading", { name: "Курсы" })).toBeVisible();

    await page.getByRole("button", { name: "ИИС", exact: true }).click();
    await expect(page.getByRole("button", { name: "Сбросить фильтры" })).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Практика инвестора в России/i })
    ).toBeVisible();
    await expect(
      page.locator('a[href="/courses/investing-fundamentals"]')
    ).toHaveCount(0);

    await page.getByRole("button", { name: "Сбросить фильтры" }).click();
    const search = page.getByPlaceholder("Поиск по названию или тегу…");
    await search.fill("инфляция");
    await expect(
      page.getByRole("link", { name: /Основы мышления инвестора/i })
    ).toBeVisible();
    await expect(
      page.locator('a[href="/courses/russia-practice"]')
    ).toHaveCount(0);
  });
});
