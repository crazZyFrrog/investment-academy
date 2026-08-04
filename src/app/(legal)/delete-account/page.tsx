export default function DeleteAccountPage() {
  return (
    <main className="mx-auto max-w-3xl space-y-6 px-6 py-16">
      <h1 className="font-display text-4xl">Удаление аккаунта</h1>
      <p className="text-body text-text-secondary">
        Чтобы удалить аккаунт и синхронизированный прогресс, напишите на адрес
        поддержки, указанный на сайте или в карточке приложения, и приложите
        email аккаунта.
      </p>
      <p className="text-body text-text-secondary">
        Гостевые данные удаляются очисткой данных сайта в браузере, сбросом
        прогресса в настройках или удалением PWA с устройства.
      </p>
    </main>
  );
}
