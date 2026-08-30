import Link from 'next/link'
import LegalSection from '@/components/legal/LegalSection'
import {
  LEGAL_OPERATOR_IDN,
  LEGAL_OPERATOR_NAME,
  STORE_MAPS_URL,
  WHATSAPP_LINK,
  WHATSAPP_PHONE,
} from '@/lib/constants'
import { AppStrings } from '@/lib/strings'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности | Lumira',
  description: 'Как Lumira Parfume обрабатывает имя и телефон при заказе.',
}

export default function PrivacyPage() {
  return (
    <main className="flex-1 bg-background">
      <div className="container-lumira section-y max-w-3xl">
        <h1 className="text-[32px] font-light leading-10 text-stone-900 md:text-[40px]">
          {AppStrings.legal.privacyTitle}
        </h1>
        <p className="mt-4 text-sm leading-[22px] text-muted">{AppStrings.legal.privacyUpdated}</p>

        <LegalSection title="1. Оператор">
          <p>
            Оператор персональных данных — {LEGAL_OPERATOR_NAME}, {LEGAL_OPERATOR_IDN}. Витрина
            работает под названием Lumira Parfume.
          </p>
          <p>
            Адрес: {AppStrings.footer.city}, {AppStrings.footer.address}. Время работы:{' '}
            {AppStrings.footer.hours}. Связь:{' '}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline">
              WhatsApp {WHATSAPP_PHONE}
            </a>
            .
          </p>
          <p>
            Политика составлена с учётом Закона Республики Казахстан «О персональных данных и их
            защите».
          </p>
        </LegalSection>

        <LegalSection title="2. Какие данные обрабатываем">
          <p>При заказе на сайте:</p>
          <ul className="list-disc space-y-1 pl-5">
            <li>имя;</li>
            <li>номер телефона;</li>
            <li>состав заказа: аромат, формат (разлив или распив), объём, количество и сумма;</li>
            <li>дата и факт согласия с офертой и этой политикой;</li>
            <li>служебный идентификатор запроса, чтобы один заказ не отправился дважды.</li>
          </ul>
          <p>Email покупателя не спрашиваем. Отдельной рассылки нет.</p>
        </LegalSection>

        <LegalSection title="3. Зачем обрабатываем">
          <p>Только чтобы принять заказ, подтвердить его в WhatsApp, согласовать оплату Kaspi и получение, и не перепутать состав. На рекламу, профилирование и продажу базы данные не используем.</p>
        </LegalSection>

        <LegalSection title="4. Как даёте согласие и сколько оно действует">
          <p>
            Согласие даёте на странице оформления заказа: отмечаете пункт «Я согласен с условиями
            публичной оферты и политикой конфиденциальности» и отправляете форму. Без этой отметки
            заказ не принимается.
          </p>
          <p>
            Факт и время согласия записываются вместе с заказом. Согласие действует в течение срока,
            необходимого для достижения указанных целей обработки, если иной срок не установлен
            законодательством или договором. Вы вправе отозвать согласие в случаях и порядке,
            предусмотренных законодательством.
          </p>
        </LegalSection>

        <LegalSection title="5. Кому передаём и где это происходит">
          <p>Для работы сайта и обработки заказов используются следующие сервисы:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <span className="text-stone-900">Supabase</span> — облачная база заказов. Проект
              магазина размещён в регионе eu-central-1 (Франкфурт, Германия). Имя, телефон,
              состав заказа и отметка согласия хранятся там. Это трансграничная передача за пределы
              Казахстана.
            </li>
            <li>
              <span className="text-stone-900">Vercel</span> — хостинг витрины. Запрос оформления
              заказа принимает функция этого хостинга и сразу передаёт данные в базу. Отдельного
              архива заказов у Vercel мы не ведём. Где именно выполняется функция, зависит от
              настроек хостинга и может быть за пределами Казахстана.
            </li>
            <li>
              <span className="text-stone-900">WhatsApp (Meta)</span> — после заказа открывается чат
              с магазином. В текст уходят имя, состав и сумма. Телефон покупателя в эту
              ссылку не подставляется. Дальше переписка идёт по правилам Meta.
            </li>
            <li>
              <span className="text-stone-900">Telegram</span> — продавцу уходит служебное
              уведомление: имя, телефон, состав и сумма, чтобы заказ не потерялся.
            </li>
          </ul>
          <p>
            В Kaspi мы сами данные с сайта не отправляем: реквизиты для оплаты продавец присылает
            уже в WhatsApp после подтверждения.
          </p>
          <p>
            Отмечая согласие, вы также соглашаетесь на передачу перечисленных данных этим лицам и
            на трансграничную обработку в объёме этого раздела.
          </p>
        </LegalSection>

        <LegalSection title="6. Что остаётся в браузере">
          <p>
            В браузере (localStorage) хранятся корзина и избранное — чтобы список не сбрасывался при
            обновлении страницы. Счётчиков посещений, пикселей рекламы и аналитики на сайте нет.
          </p>
        </LegalSection>

        <LegalSection title="7. Сколько храним">
          <p>
            Запись заказа храним, пока она нужна для исполнения и учёта, затем удаляем или
            обезличиваем, если закон не требует сохранить её дольше. Переписку в WhatsApp можно
            удалить у себя в приложении. Корзину и избранное — в настройках браузера.
          </p>
        </LegalSection>

        <LegalSection title="8. Ваши права">
          <p>
            Можно запросить, какие данные есть по вашему заказу, попросить исправить ошибку,
            отозвать согласие или удалить данные, если заказ закрыт и закон не требует хранить
            запись. Напишите в{' '}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline">
              WhatsApp
            </a>
            . Ответ — в рабочие часы, {AppStrings.footer.hours}.
          </p>
        </LegalSection>

        <LegalSection title="9. Дети">
          <p>
            Мы специально не собираем данные детей и не делаем предложений, рассчитанных на ребёнка.
            Если заказ оформили за ребёнка или вы считаете, что в базе оказались данные
            несовершеннолетнего, напишите в WhatsApp — разберёмся.
          </p>
        </LegalSection>

        <LegalSection title="10. Как с нами связаться">
          <p>
            {LEGAL_OPERATOR_NAME}, {LEGAL_OPERATOR_IDN}. {AppStrings.footer.city},{' '}
            <a href={STORE_MAPS_URL} target="_blank" rel="noopener noreferrer" className="underline">
              {AppStrings.footer.address}
            </a>
            . WhatsApp:{' '}
            <a href={WHATSAPP_LINK} target="_blank" rel="noopener noreferrer" className="underline">
              {WHATSAPP_PHONE}
            </a>
            .
          </p>
        </LegalSection>

        <p className="mt-10">
          <Link href="/" className="text-sm text-stone-900 underline">
            {AppStrings.home.shop}
          </Link>
        </p>
      </div>
    </main>
  )
}
