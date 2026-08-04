export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="font-display text-4xl">Политика конфиденциальности</h1>
      <p className="text-body text-text-secondary">
        Investment Academy хранит прогресс обучения локально на устройстве
        (IndexedDB). Если вы входите в аккаунт, пройденные уроки и статусы
        синхронизируются с серверной базой, привязанной к вашему аккаунту.
      </p>
      <p className="text-body text-text-secondary">
        При входе через Google или Apple мы получаем идентификатор и email от
        провайдера авторизации. Пароли мы не храним.
      </p>
      <p className="text-body text-text-secondary">
        XP, серии, награды и интервалы повторения в версии 1.0 остаются на
        устройстве и не отправляются на сервер. Платёжные данные при будущих
        подписках обрабатывают платёжные провайдеры — номера карт мы не
        храним.
      </p>
      <p className="text-body text-text-secondary">
        Чтобы запросить доступ, исправление или удаление данных аккаунта,
        воспользуйтесь страницей{" "}
        <a href="/delete-account" className="underline">
          удаления аккаунта
        </a>
        .
      </p>
    </main>
  );
}
