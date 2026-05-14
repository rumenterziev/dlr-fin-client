import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertDialog } from './cert-dialog';

describe('CertDialog', () => {
  let component: CertDialog;
  let fixture: ComponentFixture<CertDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
