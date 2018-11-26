import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPrecioComponent } from './lista-precio.component';

describe('ListaPrecioComponent', () => {
  let component: ListaPrecioComponent;
  let fixture: ComponentFixture<ListaPrecioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListaPrecioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPrecioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
