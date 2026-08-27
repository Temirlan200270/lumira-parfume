import { AppStrings } from '@/lib/strings'

const steps = [
  { n: '1', title: AppStrings.home.step1Title, text: AppStrings.home.step1 },
  { n: '2', title: AppStrings.home.step2Title, text: AppStrings.home.step2 },
  { n: '3', title: AppStrings.home.step3Title, text: AppStrings.home.step3 },
]

export default function HowItWorksStrip() {
  return (
    <section className="section-y bg-background">
      <div className="container-lumira">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.n}>
              <p className="text-sm tabular-nums text-muted">{step.n}</p>
              <p className="mt-2 text-base text-stone-900">{step.text}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">{AppStrings.home.raspivLine}</p>
      </div>
    </section>
  )
}
