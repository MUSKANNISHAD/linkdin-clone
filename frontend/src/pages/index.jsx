import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";
import styles from "../styles/Home.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const router = useRouter();

  return (
    <>
      <div className={styles.container}>
        <div className={styles.mainContainer}>

          <div className={styles.mainContainer_left}>

            <span className={styles.badge}>🚀 Professional Network</span>

            <h1>
              Connect. <br />
              Grow. <br />
              Succeed.
            </h1>

            <p>
              Join thousands of professionals, build meaningful
              connections, share your achievements, and discover
              exciting career opportunities.
            </p>

            <div className={styles.buttonGroup}>
              <div
                className={styles.buttonJoin}
                onClick={() => router.push("/login")}
              >
                Join Now
              </div>

              <div
                className={styles.buttonOutline}
                onClick={() => router.push("/login")}
              >
                Sign In
              </div>
            </div>

            <div className={styles.features}>
              <p>✔ Build your network</p>
              <p>✔ Share your achievements</p>
              <p>✔ Discover new opportunities</p>
            </div>

          </div>

          <div className={styles.mainContainer_right}>
            <img
              src="/images/Linkdin-connection.jpg"
              alt="LinkedIn Connection"
            />
          </div>

        </div>
      </div>
    </>
  );
}