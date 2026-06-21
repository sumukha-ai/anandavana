import React from 'react';
import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import styles from './SevaBooking.module.css';

export default function SevaBooking() {
  return (
    <>
      <PageHero title="Online Seva Booking" bgImage={bgImg} />
      <div className={styles.container}>
        <div className={styles.content}>
          <p>Book your online sevas easily through this page.</p>
        </div>
      </div>
    </>
  );
}
