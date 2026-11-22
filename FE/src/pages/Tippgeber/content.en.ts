// English version of the Tippgeber page texts (the German version in content.ts is the original).
import type { PageContent } from './content';

export const contentEn: PageContent = {
  discrepancy: 'In case of any discrepancy, the German version prevails.',
  hero: {
    eyebrow: 'Referral programme · Münster & surrounding area',
    line1: 'Your tip.',
    line2: 'Up to €4,000.',
    intro:
      'Do you know someone who wants to sell a house, an apartment or a plot of land in Münster and the surrounding area? Put them in touch with IMMO TONN. If your referral leads to a successful sale through us, we will thank you with a referral fee.',
    facts: [
      'from a €30,000 purchase price',
      '€200 to €4,000',
      '1% from €100,000',
    ],
    note: 'Payout after a successful sale and receipt of our brokerage commission. If the commission is reduced, the referral fee may be lower.',
    ctaMail: 'Send referral by e-mail',
    ctaCall: 'Call',
    conditionsLink: 'View the terms of participation',
  },
  steps: {
    title: 'How your referral works',
    items: [
      {
        title: 'Approach the owner',
        text: 'Talk to the owner about IMMO TONN. Check beforehand whether they agree to the sharing of their contact details and to being contacted by us.',
      },
      {
        title: 'Make the contact',
        text: 'Send us your referral by e-mail or get in touch by phone. We confirm receipt in text form and check whether the referral meets the terms of participation.',
      },
      {
        title: 'We support the sale',
        text: 'If the owner decides to work with us, we take care of the valuation, the marketing and the support through the sale.',
      },
      {
        title: 'Receive your referral fee',
        text: 'After the notarised sale and receipt of our brokerage commission, we pay out your referral fee within 14 days.',
      },
    ],
  },
  benefits: {
    title: 'What your acquaintance gets out of it',
    items: [
      'Free, non-binding valuation of their property',
      'Personal support from Andreas Tonn, brokerage experience since 1985',
      'A brokerage commission is only due if the sale is successful',
    ],
  },
  reward: {
    title: 'How your referral fee is calculated',
    intro:
      'The referral fee depends on the notarised purchase price stated in the purchase contract, not on the asking price.',
    table: {
      head: ['Notarised purchase price', 'Your referral fee'],
      rows: [
        ['from €30,000', '€200'],
        ['from €50,000', '€500'],
        ['from €100,000', '1% of the purchase price, at least €1,000'],
        ['from €400,000', '€4,000 (maximum)'],
        ['below €30,000', 'not part of the programme, on request in individual cases'],
      ],
    },
    noteBefore:
      'The amounts apply upon full receipt of the agreed brokerage commission. If it is reduced or only partially paid, the referral fee is reduced accordingly and may then be lower than the amounts stated. You will find the details in the ',
    noteLink: 'terms of participation',
    noteAfter: '.',
  },
  submit: {
    title: 'Submit your referral',
    intro: 'Write to us at {email} or call us on {phone}.',
    listTitle: 'Please tell us the following:',
    list: [
      'Your name and contact details',
      'Location and type of the property, with the address if possible',
      "Name and contact details of the owner, provided that the owner's consent has been given",
      'How the owner would like to be contacted',
      'When and how the owner agreed to the sharing of their data and to being contacted',
    ],
    consent:
      'The easiest way is for the owner to confirm their wish to be contacted themselves by e-mail to us, stating your name. Please register your referral with us beforehand.',
    privacyTitle: 'Data protection notes',
    privacy:
      "Only submit the owner's personal data with their prior consent. Before contacting them, we need verifiable proof of the wish to be contacted and of the preferred way of contact. We inform the owner about the data processing at the first contact.",
    privacyLink: 'To the privacy policy',
  },
  faq: {
    title: 'Frequently asked questions',
    items: [
      {
        q: 'Does my acquaintance have to sell?',
        a: 'No. Your referral is non-binding. Whether and when the owner sells is for the owner alone to decide.',
      },
      {
        q: 'What does participation cost me?',
        a: 'Nothing. Participation in the programme is free of charge for you.',
      },
      {
        q: 'Does the programme also apply to rentals?',
        a: 'No. The programme applies only to the sale of properties.',
      },
      {
        q: 'What happens if the owner already knows us?',
        a: 'In that case the referral cannot be considered. What matters is that we were not yet aware of the intention to sell at the time of your referral.',
      },
    {
      q: 'What applies to lower purchase prices?',
      a: 'For a notarised purchase price of €30,000 to €49,999 we pay €200, from €50,000 to €99,999 we pay €500, and from €100,000 you receive 1% of the purchase price. The programme does not apply below €30,000; please contact us in individual cases. The purchase price in the purchase contract is decisive, not the asking price.',
    },
    ],
  },
  conditions: {
    title: 'Terms of participation',
    provider:
      'Programme provider: Immo-Tonn, proprietor Andreas Tonn, Sessendrupweg 54, 48161 Münster.',
    imprintLink: 'Legal Notice',
    sections: [
      {
        title: 'Requirements for the referral fee',
        paragraphs: [
          'A claim to the referral fee exists if there is a referral eligible under these terms, the owner instructs IMMO TONN to sell the referred property, the sale is notarised on the basis of this instruction, and our brokerage commission has been received.',
          'The referral must have been the cause of the brokerage agreement being concluded. If the sale does not take place or no commission claim arises, no referral fee will be paid.',
        ],
      },
      {
        title: 'Which referrals are considered',
        paragraphs: [
          'We must not yet be aware of the specific intention to sell the referred property at the time of the referral. No corresponding sales instruction may already exist with us.',
          'Your referral must reach us by e-mail or by phone before the owner contacts us about this sale themselves. We confirm receipt of your referral by e-mail. The confirmation serves as a record of receipt. A claim to the referral fee only arises once all requirements are met.',
        ],
      },
      {
        title: 'Several referrals of the same property',
        paragraphs: [
          'If several referrals are received for the same property, we consider the first fully received, eligible referral. The referral fee is paid once per property sold.',
        ],
      },
      {
        title: 'Calculation of the referral fee',
        paragraphs: [
          'The referral fee depends on the purchase price notarised in the purchase contract, not on the asking price: from €100,000 it is 1% of the purchase price, at least €1,000 and at most €4,000. For a purchase price of €50,000 to €99,999 it is €500, and for a purchase price of €30,000 to €49,999 it is €200. If the notarised purchase price is below €30,000, no referral fee is payable.',
          'If the brokerage commission agreed with us is reduced or only partially paid, the regular referral fee is reduced in the same proportion. For example, if 50% of the agreed brokerage commission is received, 50% of the regular referral fee is paid out. The payout may therefore be lower than the amount stated above.',
          'If further commission payments are received later, a corresponding supplementary payment is made up to the amount of the regular referral fee.',
        ],
      },
      {
        title: 'Scope of your activity',
        paragraphs: [
          'Your activity is limited to establishing the contact between the owner and IMMO TONN. You do not act as an intermediary, do not conduct viewings or negotiations, and do not make any commitments or statements on behalf of IMMO TONN.',
        ],
      },
      {
        title: 'Payout and tax treatment',
        paragraphs: [
          'The payout is made within 14 days after receipt of our brokerage commission, provided that we have the information required for the payout and any necessary billing documents.',
          'The referral fee may be taxable. Please clarify the tax classification with your tax adviser. Commercial referrers issue us a proper invoice.',
        ],
      },
      {
        title: 'Eligibility to participate',
        paragraphs: [
          'Excluded are employees of IMMO TONN, the owner of the referred property themselves, and persons whose professional or statutory duties preclude acceptance of such a fee. This applies in particular to notaries in connection with their official activities.',
        ],
      },
      {
        title: 'Data protection and consent',
        paragraphs: [
          "An owner's personal data may only be passed on to IMMO TONN with the owner's prior consent, documented in a verifiable manner. The consent must cover contact via the stated means of contact and can be revoked for the future.",
        ],
      },
      {
        title: 'Duration of the programme',
        paragraphs: [
          'Participation is voluntary. IMMO TONN may change or end the programme for future referrals. For referrals already submitted, the terms published at the time of their receipt apply.',
        ],
      },
    ],
  },
  finalBlock: {
    title: 'Do you know someone with plans to sell?',
    text: 'Put them in touch with IMMO TONN.',
  },
};
