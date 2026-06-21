import React from 'react';
import PageHero from '../components/PageHero/PageHero';
import bgImg from '../../assets/bg1.jpeg';
import styles from './Publications.module.css';

export default function Publications() {
  return (
    <>
      <PageHero title="Publications" bgImage={bgImg} />
      <div className={styles.container}>
        <div className={styles.content}>
          <p>Explore our latest publications and articles.</p>
        </div>
      </div>
    </>
  );
}
