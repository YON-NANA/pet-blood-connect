import Link from 'next/link';

export const metadata = {
  title: "プライバシーポリシー | AnimalBloodConnect",
};

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2C3E50] font-sans leading-relaxed">
      {/* Scope styles specifically for this page */}
      <style dangerouslySetInnerHTML={{ __html: `
        .privacy-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 3rem 2rem 5rem;
        }
        .privacy-header {
          background: #003366;
          padding: 1.2rem 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          border-bottom: 4px solid #C0392B;
        }
        .privacy-header a {
          color: #fff;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: bold;
          letter-spacing: 0.05em;
        }
        .privacy-header span {
          color: #A8C8E8;
          font-size: 0.85rem;
          margin-left: auto;
        }
        .privacy-page-title {
          font-size: 1.8rem;
          font-weight: bold;
          color: #003366;
          margin-bottom: 0.4rem;
        }
        .privacy-page-subtitle {
          color: #028090;
          font-size: 0.95rem;
          margin-bottom: 0.5rem;
        }
        .privacy-updated {
          color: #888;
          font-size: 0.85rem;
          margin-bottom: 2.5rem;
          padding-bottom: 1.5rem;
          border-bottom: 2px solid #E0D8CE;
        }
        .privacy-intro {
          background: #EAF4FB;
          border-left: 4px solid #028090;
          padding: 1.2rem 1.5rem;
          margin-bottom: 2.5rem;
          border-radius: 0 8px 8px 0;
          font-size: 0.95rem;
        }
        .privacy-section {
          margin-bottom: 2.5rem;
        }
        .privacy-section h2 {
          font-size: 1.1rem;
          font-weight: bold;
          color: #003366;
          margin-bottom: 0.8rem;
          padding: 0.5rem 0.8rem;
          background: #F0EDE8;
          border-left: 4px solid #003366;
          border-radius: 0 4px 4px 0;
        }
        .privacy-section p {
          font-size: 0.95rem;
          margin-bottom: 0.8rem;
          padding-left: 0.5rem;
        }
        .privacy-section ul {
          padding-left: 1.5rem;
          margin-bottom: 0.8rem;
        }
        .privacy-section ul li {
          font-size: 0.95rem;
          margin-bottom: 0.4rem;
        }
        .privacy-highlight-box {
          background: #FFF8E1;
          border: 1px solid #FFD700;
          border-radius: 8px;
          padding: 1rem 1.2rem;
          margin: 1rem 0;
          font-size: 0.9rem;
        }
        .privacy-highlight-box strong {
          color: #C0392B;
        }
        .privacy-contact-box {
          background: #003366;
          color: #fff;
          border-radius: 8px;
          padding: 1.5rem;
          margin-top: 3rem;
        }
        .privacy-contact-box h3 {
          font-size: 1rem;
          margin-bottom: 0.8rem;
          color: #A8C8E8;
        }
        .privacy-contact-box p {
          font-size: 0.9rem;
          line-height: 1.9;
        }
        .privacy-contact-box a {
          color: #02C39A;
          text-decoration: none;
        }
        .privacy-footer {
          text-align: center;
          padding: 2rem;
          color: #888;
          font-size: 0.8rem;
          border-top: 1px solid #E0D8CE;
        }
      ` }} />

      <header className="privacy-header">
        <Link href="/">🐾 AnimalBloodConnect</Link>
        <span>Animal Mutual Aid Japan (AMAJ)</span>
      </header>

      <div className="privacy-container">
        <h1 className="privacy-page-title">プライバシーポリシー</h1>
        <p className="privacy-page-subtitle">Privacy Policy</p>
        <p className="privacy-updated">最終更新日：2026年3月　／　日本動物共助機構（AMAJ）</p>

        <div className="privacy-intro">
          日本動物共助機構（AMAJ）が運営する <strong>AnimalBloodConnect（以下「本サービス」）</strong> は、動物の緊急輸血に必要な供血ドナーと動物病院をつなぐマッチングプラットフォームです。本ポリシーは、本サービスの利用にあたって収集する個人情報の取扱いについて定めるものです。
        </div>

        {/* 第1条 */}
        <div className="privacy-section">
          <h2>第1条　収集する情報</h2>
          <p>本サービスでは、以下の情報を収集します。</p>
          <ul>
            <li><strong>ドナー登録者（飼い主）：</strong>飼い主氏名、電話番号、居住都道府県・市区町村、移動可能距離</li>
            <li><strong>登録動物：</strong>動物名、種別（犬・猫）、品種、体重、生年月日・年齢、血液型、ワクチン・健康情報</li>
            <li><strong>動物病院：</strong>病院名、都道府県、メールアドレス、パスワード（暗号化）</li>
            <li><strong>利用ログ：</strong>アクセス日時、操作履歴、チャットログ（マッチング成立後のみ）</li>
          </ul>
          <div className="privacy-highlight-box">
            <strong>重要：</strong>飼い主の氏名・電話番号は、マッチングが成立し、担当動物病院への開示に同意した場合にのみ共有されます。それ以外の場面で第三者に開示されることはありません。
          </div>
        </div>

        {/* 第2条 */}
        <div className="privacy-section">
          <h2>第2条　情報の利用目的</h2>
          <p>収集した情報は、以下の目的にのみ使用します。</p>
          <ul>
            <li>緊急供血要請に対するドナーマッチング処理</li>
            <li>距離・血液型・健康状態による適切な候補者の絞り込み</li>
            <li>マッチング成立時における病院とドナー間の連絡調整</li>
            <li>供血要請・通知のシステム処理</li>
            <li>サービスの改善および不正利用の防止</li>
          </ul>
        </div>

        {/* 第3条 */}
        <div className="privacy-section">
          <h2>第3条　情報の保管・セキュリティ</h2>
          <p>本サービスの個人情報は、<strong>Supabase（米国）</strong> が提供する暗号化されたデータベースに保存されます。</p>
          <ul>
            <li>通信はすべてSSL/TLSで暗号化されます</li>
            <li>パスワードは不可逆的なハッシュ処理により保存されます</li>
            <li>データベースへのアクセスは運営者のみに制限されます</li>
            <li>不要になった情報は速やかに削除します</li>
          </ul>
        </div>

        {/* 第4条 */}
        <div className="privacy-section">
          <h2>第4条　第三者への提供</h2>
          <p>収集した個人情報は、以下の場合を除き第三者に提供しません。</p>
          <ul>
            <li>マッチング成立時に、ご本人の同意のもと担当動物病院へ開示する場合</li>
            <li>法令に基づき開示が求められる場合</li>
          </ul>
          <div className="privacy-highlight-box">
            <strong>金銭授受は一切禁止です。</strong>本サービスを通じた謝礼・交通費等の金銭のやり取りは規約違反となります。協賛企業・広告主への情報提供も行いません。
          </div>
        </div>

        {/* 第5条 */}
        <div className="privacy-section">
          <h2>第5条　Cookieおよびアクセス解析</h2>
          <p>本サービスでは、サービス改善のためにアクセスログの収集を行う場合があります。収集するデータは匿名化されており、個人を特定するものではありません。</p>
        </div>

        {/* 第6条 */}
        <div className="privacy-section">
          <h2>第6条　登録情報の確認・修正・削除</h2>
          <p>登録者はいつでも自身の登録情報の確認、修正、削除を申請する権利を有します。</p>
          <ul>
            <li>ドナー登録者：マイページよりステータス変更・削除が可能です</li>
            <li>動物病院：ダッシュボードよりアカウント情報の編集が可能です</li>
            <li>削除依頼：下記お問い合わせ先までご連絡ください</li>
          </ul>
        </div>

        {/* 第7条 */}
        <div className="privacy-section">
          <h2>第7条　未成年者の利用</h2>
          <p>本サービスは、18歳未満の方が単独で登録することを想定していません。未成年者が利用する場合は、保護者の同意のもとでご利用ください。</p>
        </div>

        {/* 第8条 */}
        <div className="privacy-section">
          <h2>第8条　免責事項</h2>
          <p>本サービスはマッチング機能のみを提供します。供血に関する医療行為・適合試験・採血可否の判断はすべて担当獣医師の責任において行われます。運営者は医療事故・トラブルに関して一切の責任を負いません。</p>
        </div>

        {/* 第9条 */}
        <div className="privacy-section">
          <h2>第9条　ポリシーの変更</h2>
          <p>本ポリシーは、法令の改正やサービス内容の変更に伴い、予告なく改定する場合があります。改定後のポリシーは本ページに掲載した時点から効力を持ちます。重要な変更がある場合はサービス内でお知らせします。</p>
        </div>

        {/* お問い合わせ */}
        <div className="privacy-contact-box">
          <h3>📧 お問い合わせ・削除依頼</h3>
          <p>
            運営：日本動物共助機構（AMAJ）<br />
            Animal Mutual Aid Japan<br /><br />
            メール：<a href="mailto:animalbloodconnect@gmail.com">animalbloodconnect@gmail.com</a><br />
            サイト：<a href="https://animal-blood-connect.vercel.app/">animal-blood-connect.vercel.app</a>
          </p>
        </div>
      </div>

      <footer className="privacy-footer">
        <div className="space-y-3">
          <p>© 2026 Animal Mutual Aid Japan (AMAJ) ／ AnimalBloodConnect</p>
          <p className="max-w-xl mx-auto opacity-60 leading-relaxed text-[8px] md:text-[9px]">
            ※本システムはJSVTM（日本獣医輸血研究会）の献血指針・輸血方法指針・交差適合試験指針を参考に設計されています。
          </p>
          <p>すべては動物たちの明るい未来のために。</p>
        </div>
      </footer>
    </div>
  );
}
