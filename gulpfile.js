var gulp          = require('gulp'),              //Установка  gulp
    less          = require('gulp-less'),         //Припроцессор less
    browserSync   = require('browser-sync'),      //Браузер для авто обновления страницы
		cssnano       = require('gulp-cssnano'),      //Сжатие  css файлов
		rename        = require('gulp-rename'),       //Подставления суфикса .min к сжатым файлам
		del           = require('del'),               //Очистка папки dist от ненужных файлов для сохранения проекта
		imagemin      = require('gulp-imagemin'),     //Оптимизация изображения jpg
		pngquant      = require('imagemin-pngquant'), //Оптимизация изображения png
		cache         = require('gulp-cache'),        //Очистка кеша
		autoprefixer  = require('gulp-autoprefixer'), //Овтопрефиксы под устаревшие браузеры и для новых тегов
		plumber       = require('gulp-plumber'),      //Ошибка less без перезагрузки gulp
 	 	ttf2woff2     = require('gulp-ttf2woff2'),    //Конвертация шрифта в формат woff2
	  ttf2woff      = require('gulp-ttf2woff'),     //Конвертация шрифта в формат woff 
	  ttf2svg       = require('gulp-ttf-svg'),      //Конвертация шрифта в формат svg
	  ttf2eot       = require('gulp-ttf2eot'),      //Конвертация шрифта в формат eot
    notify        = require("gulp-notify"),       //Обработчик ощибок в Less компиляторе
    concat        = require("gulp-concat"),       //Для обьединения библиотек js в один фаил
    uglify        = require("gulp-uglifyjs"),     //Для сжатия библиотек
    spritesmith   = require('gulp.spritesmith'),  //Делает спрайты обьединяет иконки в одну картинку
    fontmin       = require('gulp-fontmin');      //Минификация шрифтов

//Компилятор less приобразовывает в css

gulp.task('less', function(){   //Плагин less для компиляции  css  файлов      
	 gulp.src(['app/less/**/*.less', '!app/less/libs/sprite.less', '!app/less/libs/Animate.less', '!app/less/libs/libs.less']) //Путь к файлу  style.less каторый будет обрабатыватся в stle.css
    .pipe(plumber()) 
		.pipe(less())
    .on("error", notify.onError(function(error) {  //Обработчик ощибок в Less компиляторе
          return "Message to the notifier: " + error.message;
      }))
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], {cascade: true}))
		.pipe(gulp.dest('app/css'))               //Выгрузка файла less в папку css путь!
		.pipe(browserSync.reload({stream:true}))  //Инжекстить наши стили тоесть смотреть за сохранением файла less и релодить нашу страницу с сайтом
});

//Обьединение js библиотек в один фаил и сжатие js фаила

gulp.task('scripts', function(){  //Запуск обьединения и сжатия библиотек
	return gulp.src([
			'app/libse/jquery/dist/jquery.min.js', //путь где лежит Библиотека jquery
			'app/libse/magnific-popup/dist/jquery.magnific-popup.min.js', //путь где лежит Библиотека magnific-popup
		])
	.pipe(concat('libs.min.js')) //Обьединения библиотеки
	.pipe(uglify())              //Сжатие библиотеки
	.pipe(gulp.dest('app/js'));  //Выгрузка сжатой и обьединенной библиотеки
	});

//Минификация css файла

gulp.task('cssmin', function(){
	return gulp.src('app/css/**/*.css')  //Путь где лежит фаил
	.pipe(cssnano())                     //минификация файла
	.pipe(gulp.dest('dist/css'));        //Путь куда выгружать фаил
});

//Компиляция шрифта из ttf в ttf2woff2 ttf2woff ttf2svg ttf2eot

gulp.task('font', function(){
	var buildttf = gulp.src(['app/fonts/**/*.ttf'])
	.pipe(ttf2woff2())
	.pipe(gulp.dest('app/fonts/'));
	
	var buildttf2woff = gulp.src(['app/fonts/**/*.ttf'])
	.pipe(ttf2woff())
	.pipe(gulp.dest('app/fonts/'));
	
	var buildttf2svg = gulp.src(['app/fonts/**/*.ttf'])
	.pipe(ttf2svg())
	.pipe(gulp.dest('app/fonts/'));
	
	var buildttf2eot = gulp.src(['app/fonts/**/*.ttf'])
	.pipe(ttf2eot())
	.pipe(gulp.dest('app/fonts/'));

//Минификация шрифтов

	 return gulp.src('app/fonts/**/*')
        .pipe(fontmin({
            text: ' ',
            fontPath: '../fonts/',
        }))
        .pipe(gulp.dest('app/fonts'));
});

//Запусб браузера для проверки сайта

gulp.task('browser-sync', function(){ // запуск Браузера
	browserSync({
		server:{
			baseDir: 'app'    //Корень сайта в катором лежит сайт для запуска в браузере
		}
	});
});

//Удаления файла или папки

gulp.task('clean' ,function(){
	return del.sync('dist');    //Удаления папки dist  куда выгружается весь собраный и скомпилированный сайт
});

//Очистка

gulp.task('clear' ,function(){
	return cache.clearAll();
});

//Минификация картинок

gulp.task('img', function(){
	return gulp.src("app/img/**/*.{png,jpg,gif,jpeg}")  //Путь откуда берем картинки для минификации
	.pipe(imagemin([
		imagemin.optipng({optimizationLevel:3}),
		imagemin.jpegtran({progressive: true})
	]))
	.pipe(gulp.dest('dist/img'));  //Путь куда выложить картинки
});

//Компиляция иконов в спрайты

gulp.task('sprite', function () {
  var spriteData = gulp.src('app/icon-sprite/*.png').pipe(spritesmith({  //Путь откуда берутся иконки для компиляции спрайтов
    imgName: 'icon-sprite.png',    //Имя готового спрайта
    cssName: 'sprite.less',        //В каком формате будет компилироватся спрайт sprite.less
    cssFormat: 'less',             //Формат компиляции
    imgPath: '../img/sprite/icon-sprite.png', //Путь для подключения спрайта каторый прописывается в css
    padding: 20                               //Отступы между спрайтами
  }));
   spriteData.img.pipe(gulp.dest('app/img/sprite/')); // путь, куда сохраняем картинку
   spriteData.css.pipe(gulp.dest('app/less/libs'));       // путь, куда сохраняем стили
});

//Слежения за изменениями в Браузере browser-sync и в файле less

gulp.task('watch', ['browser-sync', 'less', 'scripts'], function(){   //Запуск less поттом browser-sync потом uglify
	gulp.watch(['app/less/**/*.less'],['less']);   //Проце слежения за изменениями файлов
  gulp.watch('app/*.html', browserSync.reload);                          //Выбо в корне всех файлов с расширение html и как только чтота в них изменится перегружает страницу с сайтом
  gulp.watch('app/js/**/*.js', browserSync.reload);                      //Выбо в корне всех файлов с расширение js и как только чтота в них изменится перегружает страницу с сайтом	
});

//Компиляция готового продукта зборка всего сайта со всеми минификации и компиляциями

gulp.task('prod', ['clean', 'less', 'cssmin', 'img'], function(){
	
	var buildFonts = gulp.src('app/fonts/**/*.{eot,svg,ttf,woff,woff2}')
	.pipe(gulp.dest('dist/fonts'));
	
	var buildJs = gulp.src('app/js/**/*js')
	.pipe(gulp.dest('dist/js'));
	
	var buildHtml = gulp.src(['app/*.html', 'app/*.ico'])
	.pipe(gulp.dest('dist'));
});

           // Записа тасков для выполнения отдельных ккоманд

// npm i              запуск и скачивания пакетов перед началом работы установка папки node_modules где содержатся все программы для работы

// gulp watch         Запуск слежения за установленными прогамамми 
// gulp font          Запуск компиляции ttf в форматы  'ttf2woff2', 'ttf2woff', 'ttf2svg', 'ttf2eot',
// gulp minfont       Минификация шрифтов
// gulp sprite        Копиляция иконок картинок в одну картинку в спрайт
// gulp Prod          Выгружение всего готового сайта в отдельную папку

//bower i jquery magnific-popup Пакеты дополнительные плагины

// gulp less          запуск компиляция style.less файла в style.css 
// gulp browser-sync  Запуск браузера для проверки сайта
// gulp watch         Запуск всех програм сначала браузер синг патом лес
// gulp uglify        Запуск сжатия всех js файлов и выгрузка в указанное место
// gulp clean         Удоляет папку dist со старым проектом 
// gulp clear         Очистка кеша для img картинок
// gulp img           Оптимизация png jpg картинок

//git config --global user.name "InGame"  После установки git открываем консоль и пишем эту запись 
//git config --global user.email "alex_ru88@mail.ru"  Если нет ошибок пишем свой реальный email 
//git config --list Проверка настроек


//Установить программу node.js  https://nodejs.org/en/

// npm i gulp -g                                     Установка gulp node.js глобально 
// npm init                                          Инициализация фаил для сборки всех програм каторыми буду пользоваться 
// npm i gulp --save-dev                             установка версии и запись версии в пекетджесон 
// npm i gulp-less --save-dev                        Установа less компилятора 
// gulp less                                         Запуск компилятора лес
// npm i browser-sync --save-dev                     Браусзер авто обнеовления страницы после сохренения style.less 
// npm i -g bower --save-dev                         плагины js и jQuery 
// npm i gulp-concat gulp-uglifyjs                   библиотеки js и jQuery 
// npm i gulp-cssnano gulp-rename --save-dev         Сжатие css файла и добовления суфикса .min к сжатым файлам 
// npm i --save-dev gulp-imagemin imagemin-pngquant  Автоматическая оптимизация изображения Сжатия картинок 
// npm i gulp-cache --save-dev                       Очистка кеша 
// npm i --save-dev gulp-autoprefixer                Овтопрефиксы под устаревшие браузеры и для новых тегов 
// npm i --save-dev gulp gulp-less gulp-util          Для вывода ошибки в less
// npm i --save-dev gulp.spritesmith                  установка спрайтов


//bower i jquery magnific-popup Пакеты дополнительные плагины
//bower install font-awesome-animation пакеты для анимации иконок http://l-lin.github.io/font-awesome-animation/

//npm i -g npm-check-updates       Для проверки новых версий пакетов
//ncu                              Для Определения тсарых пакетов
//ncu -u                           Для установки обновленных пакетов  либо это 
//ncu -a                           Для установки обновленных пакетов  или это

////////////////////////////////GIT///////////////////////////////////////

//	Создаем папку с названием ( .gitignore ) для игнора node_modules 
//	rm -rf .git удаления папки .git

//	git config --global user.name "InGame"  После установки git открываем консоль и пишем эту запись
//	git config --global user.email "alex_ru88@mail.ru"  Если нет ошибок пишем свой реальный email 
     //	Первоночальнвя настрйко git окончена 
     //	после первоночальных настроек заходим в папку с проектом нажимаем Git Bash Here  и пишим
//	git config --list  просмотр настроек имя и емаил введен ли правильно 

//	git init  Инициализировался пустой Git репозиторий 
//	git status  Пишем эту команду и смотрим что у нас в папке есть два фаил светятся красным цветом index.html каторый не отслеживается gitom и есть папка css тоже не отслеживается gitom*/
//  git add . Пишем  точка значит все что неотслеживается надо отслеживать 
		//	git rm --cached index.html фаил индекс не будет добовлятся в репозиторий
		//	git add index.html возвращает фаил для комита
//	git status  Пишем и видем два файла уже зеленым цветом значит они отслеживаются gitom 
    //	Для отслеживания изменения и для сохранения в нашем репозитории тогда мы комитем 
//	git commit -m "First commit"  Комит для репозитория  "First commit" названия комита для сохраненимя изменений в проекте
//	git log История комитов
//	git push закомитеть весь проект на удоленном сайте https://github.com
//	git clone https://github.com/Alexsander1988/Project.git  копируем с https://github.com сылку на скачивания проекта https://github.com/Alexsander1988/Project.git и вставляем в CMD вызвыв CDM в ту папку куда будет скинут клон проекта
//	git log --oneline Просмотр комитов с сокращеными именами 7fa0eb2 margit и названиями комита
//	git checkout 7fa0eb2 переход на определенный комит через сокращенное имя комита
//	git checkout master возврат на оснавной комит
//	git branch -v показывает сколько веток
//	git fetch Забрать обновленные данные с https://github.com после другого програмиста они присутствуют в папке .git
// git pull забираем данные из папки .git и вносим изменения в наш проект на комп
//	git merge branch2 присоединения ветки в  masters и если есть конфликты используемп команду ниже
//	git mergetool для конфликтов предварительно скачав  прогроаму http://kdiff3.sourceforge.net
//	git config --global merge.tool kdiff3 при конфликте и установки программы делаем запись в CMD патом указываем путь куда установлена програма http://kdiff3.sourceforge.net git config --global mergetool.kdiff3.cmd '"w:\\Program Files\\KDiff3\\kdiff3" $BASE $LOCAL $REMOTE -o $MERGED'
//	git log --pretty=format:"%h - %an, %ar : %s"  просмотр всех комитов в git
//	git log показывает историю комитов
//	git log --pretty=format:"%h - %an, %ar : %s"  Показываетвсе комиты имя кто сделал комит время когда было зделоно изменения и названия комита
//	git log -p -2  Показывает все изменения и комит в командной строке

///////////////////////////ПЛАГИНЫ ДЛЯ Google Chrome////////////////////////////////
//		https://chrome.google.com/webstore/detail/font-playground/hdpmpnhaoddjelneingmbnhaibbmjgno/related?hl=en Плагин для для подборки шрифтов для сайта
//		https://chrome.google.com/webstore/detail/whatfont/jabopobgcpjmedljpbcaablpmlmfcogm/related?hl=en при нажатии на иконку f показывает какой шрифт применяется к тегам
//    https://chrome.google.com/webstore/detail/web-developer/bfbameneiokkgbdmiekhjnmfkcnldhhm ОТключения куки картинос style.css для проверки сайта
//		https://chrome.google.com/webstore/detail/web-developer-checklist/iahamcpedabephpcgkeikbclmaljebjp  для проверки сео и Mobile  PageSpeed 
//		https://chrome.google.com/webstore/detail/perfectpixel-by-welldonec/dkaagdgjmgdmbnecmcefdhjekcoceebi?hl=en  Проверка верстки сайта пиксель в пиксель по картинке png jpg
//    https://chrome.google.com/webstore/detail/ie-tab/hehijbfgiekmjfkfjpbkbammjbdenadd плагин для отображения сайта в IE 7 8 9 10 11
//		https://chrome.google.com/webstore/detail/page-ruler/jlpkojjdgbllmedoapgfodplfhcbnbpn   показываент размеры любого блока или пустого пространства между блоками 
//		https://chrome.google.com/webstore/detail/check-my-links/ojkcdipcgfaekbeaelaapakgnjflfglf  Проверка сыллок на валидность и заполнения href="#"
//		https://chrome.google.com/webstore/detail/code-cola/lomkpheldlbkkfiifcbfifipaofnmnkn?hl=en  Плагин для добовления много разных эфекстов для блоков заголовок с помощью CSS


//		https://chrome.google.com/webstore/detail/clear-cache/cppjkneekbjaeellbfkmgnhonkkjfpdn/related	очистка браузера кеш куки загрузки
//		https://chrome.google.com/webstore/detail/instant-wireframe/pmpmnmbgidlnoamkpmcikaejhmeldnha Для  расположения блоков сайты как они расположены
//    https://chrome.google.com/webstore/detail/web-sniffer/ndfgffclcpdbgghfgkmooklaendohaef Просмотр что подгружается нас странице какие скрипты картинки шрифты стили
//    https://chrome.google.com/webstore/detail/resolution-test/idhfcdbheobinplaamokffboaccidbal Позволяет тестировать сайт на различных разрешениях сайта
//		https://chrome.google.com/webstore/detail/seoquake/akdgnmcogleenhbclghghlkkdndkjdjc для SEO оптимизации