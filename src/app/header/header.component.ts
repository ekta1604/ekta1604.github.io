import { Component, OnInit, Input, ViewChild, ElementRef, Renderer2, Inject, LOCALE_ID } from '@angular/core';
import { faBars, faShareAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';
import { NgNavigatorShareService } from 'ng-navigator-share';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './header.component.responsivity.scss']
})

export class HeaderComponent implements OnInit {
    
  private _activeSection: any;
  private _pageXOffset: any;
  private ngNavigatorShareService: NgNavigatorShareService;
  
  hasMenuToggled: boolean;
  faBars: IconDefinition;
  faShareAlt: IconDefinition;

  @ViewChild('nav') nav: ElementRef;
  @ViewChild('shareBtn') shareBtn: ElementRef;

  constructor(
    @Inject(LOCALE_ID) public locale: string,
    private renderer: Renderer2,
    ngNavigatorShareService: NgNavigatorShareService
  ) {
    this.ngNavigatorShareService = ngNavigatorShareService;
  }

  // use getter setter to define the properties
  get activeSection(): any { 
    return this._activeSection;
  }
  
  get pageXOffset(): any { 
    return this._pageXOffset;
  }

  @Input()
  set pageXOffset(value: any) {
    this._pageXOffset = value;
    this.onDetectScreenSize();
  }

  @Input()
  set activeSection(value: any) {
    this._activeSection = value;
    this.updateNavigation();
  }

  ngOnInit(): void {
    this.faBars = faBars;
    this.faShareAlt = faShareAlt;

    // Share button available only for browsers that do support it.
    if (this.ngNavigatorShareService.canShare()) {
      this.nav.nativeElement.style.display='block';
    }
  }

  private updateNavigation() {

    if(this._activeSection && this.renderer) {
      
      // Remove any selected anchor
      const activePreviousElem = this.nav.nativeElement.querySelector('a.active');
      
      if(activePreviousElem) {
        this.renderer.removeClass(activePreviousElem, 'active');
      }

      const targetElem = this.nav.nativeElement.querySelector(`a[href^="#${this._activeSection}"]`);
      if(targetElem) {
        this.renderer.addClass(targetElem, 'active');
      }
    }
  }

  /*
   * For media types such as tablets and mobile devices, the nav-bar navigation should be
   * collapsed by default.
  */
  private onDetectScreenSize() {
    this.hasMenuToggled = this.pageXOffset > 1024;
  }

  onToggleBar() {
    this.hasMenuToggled = !this.hasMenuToggled;
  }

  resetMenu() {
    this.hasMenuToggled = this.pageXOffset > 1024;
  }

  async share() {
    try{
      const sharedResponse = await this.ngNavigatorShareService.share({
        title:'`Live Resume - Guilherme Borges Bastos',
        text: `Hello, I'm a Full-stack Java Web Developer with 10+ years of experience designing web and mobile projects. Find out more in my live-resume!`,
        url: 'https://guilhermeborgesbastos.com'
      });
      console.log(sharedResponse);
    } catch(error) {
      console.log('You app is not shared, reason: ',error);
      if(error.shared === false) {
        alert(`Sorry, this service/api is not supported in your Browser.`);
      }
    }    
  }
}