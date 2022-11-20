import "../styles/about.css";
import "../styles/filters.css";
import Navbar from "../components/Navbar";
import Card from "../components/Card";
import PageContent from "../components/PageContent";
import { ThemeLoader } from "../themes/Themes";
import PageBackground from "../components/PageBackground";
import Footer from "../components/Footer";
import { Spacer } from "../components/Spacer";
import { GenericButton } from "../components/GenericComponents";
import { Link } from "react-router-dom";
import { useAuth } from "../auth/auth";

function About() {
  const { authenticated } = useAuth();

  return (
    <>
      <Spacer>
        <h1>Our Story</h1>
        <Card>
          <p className="about__text--highlighted">Bucket List </p>
          <p className="about__text">
            was founded in 1202 by a small group of travel enthusiasts who
            discovered javascript engraved on a stone in their village.
            <br />
            <br />
            They wanted to make an easy way to plan what they wanted to do in
            their life and the destinations they wanted to visit.
          </p>
        </Card>

        <h1>What's Bucket List?</h1>
        <Card>
          <p className="about__text">A </p>
          <p className="about__text--highlighted">Bucket List </p>
          <p className="about__text">
            is a list of experiences or achievements that you might want to
            accomplish during your lifetime.
            <br />
            <br />
          </p>
          <p className="about__text--highlighted">BucketListApp.org </p>
          <p className="about__text">
            will help you get done what you want most, by keeping track of all
            the things you've
          </p>
          <p className="about__text--highlighted"> always wanted to do.</p>
        </Card>

        {/* Link out of the page */}
        <br />
        {authenticated === false && (
          <>
            <h1>Sign up</h1>
            <Card>
              <p className="about__text">
                If our terrible pitch somehow convinced you, then why not sign
                up and give it a go?
              </p>
            </Card>
            <Link to="/signup">
              <GenericButton className="about__link--sign-up">
                Sign Up
              </GenericButton>
            </Link>
          </>
        )}
        {authenticated && (
          <>
            <Card>
              <p className="about__text">Thanks for using</p>
              <p className="about__text--highlighted"> Bucket List</p>
              <p className="about__text">!</p>
            </Card>
            <Link to="/destinations">
              <GenericButton className="about__link--sign-up">
                My Destinations
              </GenericButton>
            </Link>
          </>
        )}
      </Spacer>
    </>
  );
}

function AboutPage() {
  document.title = "Bucket List - About";
  return (
    <>
      <Footer>
        <ThemeLoader />
        <Navbar />
        <PageBackground />
        <PageContent>
          <About />
        </PageContent>
      </Footer>
    </>
  );
}

export default AboutPage;
