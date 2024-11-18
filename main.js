// change navbar styles on scroll

window.addEventListener('scroll', () => {
    document.querySelector('nav').classList.toggle('window-scroll', window.scrollY > 0)
})



// show/hide faq answer

const faqs = document.querySelectorAll('.faq');

faqs.forEach(faq => {
    faq.addEventListener('click', () => {
        // إغلاق كل الأسئلة الأخرى
        faqs.forEach(item => {
            if (item !== faq) {
                item.classList.remove('open');
                const otherIcon = item.querySelector('.faq__icon i');
                otherIcon.className = 'uil uil-plus';
            }
        });

        // تبديل حالة السؤال الحالي
        faq.classList.toggle('open');

        // تغيير الأيقونة
        const icon = faq.querySelector('.faq__icon i');
        icon.className = faq.classList.contains('open') ? 'uil uil-minus' : 'uil uil-plus';
    })
})


// show/hide nav menu
const menu = document.querySelector('.nav__menu');
const menuBtn = document.querySelector('#open-menu-btn');
const closeBtn = document.querySelector('#close-menu-btn');

// فتح القائمة
menuBtn.addEventListener('click', () => {
    menu.style.display = 'flex';
    closeBtn.style.display = 'inline-block';
    menuBtn.style.display = 'none';
})

// إغلاق القائمة
closeBtn.addEventListener('click', () => {
    menu.style.display = 'none';
    closeBtn.style.display = 'none';
    menuBtn.style.display = 'inline-block';
})
