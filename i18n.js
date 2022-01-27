import i18n from 'i18n-js';
import * as Localization from 'expo-localization';
import {es} from './assets/i18n/es';
import {fr} from './assets/i18n/fr';
import {en} from './assets/i18n/en';
import {gl} from './assets/i18n/gl';
import {pt} from './assets/i18n/pt';

export const getI18n = () =>{
      
      i18n.fallbacks = true;
      i18n.translations = { fr, en, es, gl, pt };
      i18n.locale = Localization.locale;

      return i18n;
      
}

/*    EJEMPLO DE USO
      import {getI18n} from './../../i18n';

      <Text>
        {getI18n().t('foo')} {getI18n().t('bar', { someValue: Date.now() })}
      </Text>


*/


