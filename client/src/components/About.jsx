import Nav from './Nav.jsx'; 
import BackButton from "./BackButton.jsx";

function About() {
  return (
    <>
      <Nav/>
      <div className="flexLeft">
        <BackButton to={"/"} />
      </div>
      <div className="container mt-5 mb-5">
        <h1 className="mb-4">About Gaucho Grub</h1>
        <hr/>

        <section className="mb-4">
          <h3>Our Mission</h3>
          <p>
            Gaucho Grub was created with one goal in mind: to make UCSB dining easier, smarter, and more satisfying.
            We help students quickly check daily dining hall menus, rate their favorite meals, and explore the best food
            UCSB has to offer. All in one clean, easy-to-use interface.
          </p>
        </section>

        <section className="mb-4">
          <h3>Meet the Team</h3>
          <p>
            Gaucho Grub was built by Alvin Lee and Nathan Ngo, two UCSB students passionate about clean UI and
            helping address a real-world problem. We hope this project serves you as well as it serves us.
          </p>
        </section>

        <section>
          <h3>Future Vision</h3>
          <p>
            We're continuing to improve Gaucho Grub with new features like user accounts, favorite dish tracking,
            and dietary filters. We are looking at potentially making an app that we can launch on the Apple Store and Google Play Store. Got ideas or feedback? Let us know. We're always <i>hungry</i> for suggestions.
          </p>
        </section>
      </div>

    </>
  );
}

export default About;
