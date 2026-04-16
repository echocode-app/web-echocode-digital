import SectionContainer from '@/components/UI/section/SectionContainer';
import LegalBlock from '../components/LegalBlock';
import SectionGradientLine from '@/components/UI/section/SectionGradientLine';
import LegalDropdown from '../components/LegalDropdown';
import LinksList from '../components/LinksList';

const LegalSection = () => {
  return (
    <section className="pt-10 pb-5 md:pb-19.5">
      <SectionContainer>
        <LegalBlock>
          This privacy policy applies to the EchoVPN: Fast VPN, Secure Proxy app hereby referred to
          as Application for mobile devices that was created by IMMOLA-GmbH hereby referred to as
          Service Provider as a Freemium service. This service is intended for use AS IS.
        </LegalBlock>
        <SectionGradientLine height="1" fullWidth />
        <ul className="flex flex-col gap-6 mb-6">
          <LegalDropdown title="Information Collection and Use">
            <p>
              The Application collects information when you download and use it. This information
              may include:
            </p>
            <ul>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>Your devices Internet Protocol address (e.g. IP address)</p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>
                  The pages of the Application that you visit, the time and date of your visit, the
                  time spent on those pages
                </p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>The operating system you use on your mobile device</p>
              </li>
            </ul>
            <p>
              The Application does not gather precise information about the location of your mobile
              device. The Application does not use Artificial Intelligence (AI) technologies to
              process your data or provide features.
              <br /> The Service Provider may use the information you provided to contact you from
              time to time to provide you with important information, required notices and marketing
              promotions.
              <br /> For a better experience, while using the Application, the Service Provider may
              require you to provide us with certain personally identifiable information, including
              but not limited to matthiasgayle2026@outlook.com. The information that the Service
              Provider request will be retained by them and used as described in this privacy
              policy.
            </p>
          </LegalDropdown>
          <LegalDropdown title="Third Party Access ＆ VPN Services">
            <p>
              Only aggregated, anonymized data is periodically transmitted to external services to
              aid the Service Provider in improving the Application and their service.
              <br /> VPN Infrastructure: The Application utilizes the Surfshark API to provide
              Virtual Private Network (VPN) capabilities. By using this service, you acknowledge
              that your connection may be routed through servers maintained by Surfshark. The
              Application currently offers connectivity to servers located in the following
              countries:
            </p>
            <ul>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>Germany</p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>United States</p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>Netherlands</p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>France</p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>United Kingdom</p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>Finland</p>
              </li>
            </ul>
            <p>
              Please note that the Application utilizes third-party services that have their own
              Privacy Policies regarding data handling. Below are the links to the Privacy Policies
              of the third-party service providers used by the Application:
            </p>
            <LinksList />
            <p>
              The Service Provider may disclose User Provided and Automatically Collected
              Information:
            </p>
            <ul>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>
                  as required by law, such as to comply with a subpoena, or similar legal process;
                </p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>
                  when they believe in good faith that disclosure is necessary to protect their
                  rights, protect your safety or the safety of others, investigate fraud, or respond
                  to a government request;
                </p>
              </li>
              <li className="flex gap-2 items-center">
                <div className="w-1 h-1 bg-gray75 rounded-full" />
                <p>
                  with their trusted services providers who work on their behalf, do not have an
                  independent use of the information we disclose to them, and have agreed to adhere
                  to the rules set forth in this privacy statement.
                </p>
              </li>
            </ul>
          </LegalDropdown>
          <LegalDropdown title="Opt-Out Rights">
            <p>
              You can stop all collection of information by the Application easily by uninstalling
              it. You may use the standard uninstall processes as may be available as part of your
              mobile device or via the mobile application marketplace or network.
            </p>
          </LegalDropdown>
          <LegalDropdown title="Data Retention Policy">
            <p>
              The Service Provider will retain User Provided data for as long as you use the
              Application and for a reasonable time thereafter. If youd like them to delete User
              Provided Data that you have provided via the Application, please contact them at
              matthiasgayle2026@outlook.com and they will respond in a reasonable time.
            </p>
          </LegalDropdown>
          <LegalDropdown title="Children">
            <p>
              The Service Provider does not use the Application to knowingly solicit data from or
              market to children under the age of 13. The Application does not address anyone under
              the age of 13. If the Service Provider discovers that a child under 13 has provided
              personal information, they will immediately delete this from their servers. If you are
              a parent or guardian and are aware that your child has provided us with personal
              information, please contact the Service Provider.
            </p>
          </LegalDropdown>
          <LegalDropdown title="Security">
            <p>
              The Service Provider is concerned about safeguarding the confidentiality of your
              information. The Service Provider provides physical, electronic, and procedural
              safeguards to protect information the Service Provider processes and maintains.
            </p>
          </LegalDropdown>
          <LegalDropdown title="Changes">
            <p>
              This Privacy Policy may be updated from time to time for any reason. The Service
              Provider will notify you of any changes to the Privacy Policy by updating this page
              with the new Privacy Policy. You are advised to consult this Privacy Policy regularly
              for any changes, as continued use is deemed approval of all changes.
            </p>
          </LegalDropdown>
        </ul>
        <p className="mb-7 font-medium">This privacy policy is effective as of 2026-04-08</p>
        <ul>
          <LegalDropdown title="Your Consent">
            <p>
              By using the Application, you are consenting to the processing of your information as
              set forth in this Privacy Policy now and as amended by us.
            </p>
          </LegalDropdown>
        </ul>
      </SectionContainer>
    </section>
  );
};

export default LegalSection;
