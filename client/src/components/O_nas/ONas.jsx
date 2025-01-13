import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom"
import '../css/Style.css'
import styles from './ONas.module.css'
import foto3 from '../css/img/foto3.jpg';
import foto4 from '../css/img/foto4.jpg';
import foto5 from '../css/img/foto5.png';
import foto6 from '../css/img/foto6.png';
import foto7 from '../css/img/foto7.png';
import foto8 from '../css/img/foto8.png';

const ONas = () => {
    return(
        <div>
            <h2>O naszej firmie i działalności</h2>
            <main>
                <article>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur consequat in urna eget convallis. Aliquam vel nibh et velit fermentum ullamcorper. Vivamus nec facilisis felis, sed aliquet turpis. Suspendisse at porttitor leo, ac euismod ipsum. Sed facilisis cursus ex eu tincidunt. Sed facilisis dignissim est, eget vulputate nisi porta ac. Curabitur semper diam sit amet augue facilisis vehicula. Morbi faucibus risus quis mauris molestie dignissim. Nullam lacinia ullamcorper nisl, at consequat ipsum. Suspendisse interdum neque arcu, id scelerisque quam faucibus eu. Donec porta nulla tortor, et laoreet diam vehicula sed. Nam tincidunt mollis magna a lobortis.
                    </p>
                    <div className={styles.photos}>
                        <img src={foto3}/>
                        <img src={foto4}/>
                    </div>
                    <p>
                        Integer vitae sem vestibulum, sodales tellus quis, iaculis nibh. Nulla dignissim id orci vitae hendrerit. Pellentesque quis lectus at leo elementum posuere lobortis suscipit neque. Proin ut eros nec ligula cursus varius quis non urna. Sed vitae posuere leo, quis finibus nunc. In libero elit, efficitur a nibh nec, luctus suscipit massa. Interdum et malesuada fames ac ante ipsum primis in faucibus. Praesent consequat commodo velit, a pellentesque libero ullamcorper sit amet. Nulla pulvinar placerat lobortis. Phasellus a semper nibh, id mattis elit. Nam lacinia varius metus, non finibus nulla commodo non.
                    </p>
                    <div className={styles.photos}>
                        <img src={foto5}/>
                        <img src={foto6}/>
                    </div>
                    <p>
                        Duis dignissim condimentum nunc, eget bibendum nisi efficitur ac. Maecenas auctor a lorem a maximus. Etiam pulvinar eleifend nisl, a hendrerit mauris. Aliquam condimentum, elit at ultrices rhoncus, ligula purus pretium quam, eu ultricies mauris nunc a nibh. Nam interdum, mauris imperdiet dignissim fermentum, leo quam sagittis tellus, quis ornare nisi augue sit amet augue. Donec ac luctus velit. Proin non sapien eget eros facilisis porttitor. Suspendisse ac elementum ex. Pellentesque mauris orci, sodales eu viverra nec, dapibus at justo. Duis id mauris massa. Nulla quis massa id tellus egestas ultrices. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
                    </p>
                    <div className={styles.photos}>
                        <img src={foto7}/>
                        <img src={foto8}/>
                    </div>
                    <p>
                        Aliquam dictum a justo ac faucibus. Phasellus tortor nunc, aliquam in ligula a, tempus egestas nulla. Aenean dignissim, nisi eu commodo dictum, est mi molestie massa, eget tristique est nunc sit amet lectus. Praesent imperdiet nec nisl in auctor. Nunc orci sem, varius quis diam nec, ullamcorper facilisis quam. Proin convallis mollis odio a blandit. Mauris egestas dolor quis nulla pretium, ac porta risus facilisis. Maecenas dictum quam in consectetur elementum. Aliquam erat volutpat. Phasellus ut risus eget lorem lobortis vestibulum ac ut purus. Sed id dolor velit. Nullam accumsan eu metus sed blandit. Vivamus dolor mauris, rhoncus sed convallis ac, eleifend sed nunc. In hac habitasse platea dictumst. Suspendisse fermentum placerat dui, ac dignissim velit tristique vel.
                    </p>
                </article>
            </main>
	    </div>
    );
};

export default ONas;