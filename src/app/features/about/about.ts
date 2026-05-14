import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CertDialog } from '../cert-dialog/cert-dialog';

interface SkillGroup {
  title: string;
  icon: string;
  items: string[];
}

interface TimelineItem {
  date: string;
  title: string;
  company?: string;
  location?: string;
  text: string;
  tech?: string[];
}

type Availability = 'open' | 'closed';

interface Cert {
  title: string;
  issuer: string;
  image: string;
}

@Component({
  selector: 'app-about',
  imports: [CommonModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private readonly dialog = inject(MatDialog);
  readonly skillGroups: SkillGroup[] = [
    {
      title: 'Languages',
      icon: 'code',
      items: ['Java', 'TypeScript', 'JavaScript', 'Python', 'SQL'],
    },
    {
      title: 'Frameworks',
      icon: 'extension',
      items: ['Spring Boot', 'Angular', 'RxJS', 'Hibernate'],
    },
    {
      title: 'Cloud & DevOps',
      icon: 'cloud',
      items: ['Azure', 'Docker', 'Jenkins', 'Nginx'],
    },
    {
      title: 'Tools',
      icon: 'build',
      items: ['Git', 'Redis', 'Jira', 'IntelliJ', 'VS Code'],
    },
  ];

  readonly experience: TimelineItem[] = [
    {
      date: 'Feb 2026 — Apr 2026',
      title: 'Software Developer',
      company: 'Smar 7 Tools',
      text: 'Building the company website from the ground up, alongside a separate online store with payment integration. Owning the technical ecosystem end-to-end — architecture, infrastructure, deployment, domains, workspaces and developer tooling — defining standards and keeping everything running reliably.',
      tech: ['Angular', 'Spring Boot', 'MySQL', 'Docker', 'Nginx'],
    },
    {
      date: 'Sep 2024 — Sep 2025',
      title: 'Software Developer',
      company: 'DHR Engineering',
      text: 'Started on an internal R&D project, programming a new robot from scratch. After several months I joined an automation project delivering a brand-new robot for an American client, contributing across control logic and tooling.',
      tech: ['Java', 'Spring Boot', 'Python'],
    },
    {
      date: 'Sep 2023 — Apr 2024',
      title: 'Junior Java Developer',
      company: 'Delta Source',
      text: 'After completing the internship and training program, joined the team building an internal HR system that automated administrative workflows. Focused mainly on backend development, with occasional frontend tasks.',
      tech: ['Java', 'Spring Boot', 'MySQL', 'Angular'],
    },
  ];

  readonly education: TimelineItem[] = [
    {
      date: 'May 2022 — Dec 2024',
      title: 'Software Engineering Diploma — SoftUni',
      text: 'Intensive program covering software architecture, algorithms, databases and cloud-native development through a hands-on, project-based curriculum.',
    },
    {
      date: '2022',
      title: 'Started programming',
      text: 'A free online Java course at SoftUni sparked a deep interest that turned into a career.',
    },
  ];

  readonly availability: Availability = 'open';

  readonly certificates: Cert[] = [
    {
      title: 'Oracle Certified Associate',
      issuer: 'Oracle — Java Programmer',
      image: 'certificates/oracle-cert.jpg',
    },
    {
      title: 'Software Engineering Diploma',
      issuer: 'SoftUni',
      image: 'certificates/softuni-diploma.jpg',
    },
  ];

  openCert(cert: Cert): void {
    this.dialog.open(CertDialog, {
      data: cert,
      maxWidth: '92vw',
      maxHeight: '92vh',
      panelClass: 'cert-dialog',
      autoFocus: 'dialog',
    });
  }
}
