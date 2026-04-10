# SkyGuide TR - Aviation Assistant Frontend

Bu proje, havacılık, uçuş prosedürleri ve havalimanı teknik özellikleri gibi sorulara yapay zeka destekli hızla geri dönüş sağlayan **SkyGuide TR** uygulamasının mobil/web (Expo React Native) önyüzünü içerir.

Kod tabanı, baştan sona **Clean Code (Temiz Kod)**, modüler yapı, yüksek performanslı bileşen işleme prensipleri ve katı **TypeScript** kuralları çerçevesinde refactor edilmiştir.

## 🛠 Kullanılan Teknolojiler

- **React Native & Expo**: Çapraz platform (iOS, Android, Web) uyumluluğu.
- **TypeScript**: Katı tip denetimleri, `any` tiplerinden tamamen arındırılmış `interface` mimarisi.
- **Zustand & AsyncStorage**: Hafif, hızlı ve cihaz belleğinde kalıcı (persist) olarak tutulan Global Chat State yönetimi.
- **@shopify/flash-list**: Performanslı, bellek dostu, yüksek frame rateli (60 FPS) sohbet listesi gösterimi.
- **Lucide React Native**: Şık, pürüzsüz vektörel ikonlar.
- **React Native Reanimated & LayoutAnimation**: Yumuşak ekran geçişleri ve akıcı UI baloncuğu (bubble) animasyonları.

---

## 🏗 Mimari & Modülerlik (Neler Yaptık?)

Eskiden tüm uygulamanın yükünü tek başına çeken monolitik ekran yapıları (örn: `ChatScreen.tsx`), tek sorumluluk prensibine (Single Responsibility) göre modüllere ayrıştırılmıştır:

- `ChatHeader`: Menü yönetimi ve başlık çubuğu.
- `ChatInputArea`: Klavye yönetimi, girdi alanı ve durdurma/gönderme mekanizması.
- `Sidebar` & `SidebarThreadItem`: Yan çekmece menüsü, sohbet geçmişlerinin optimize bir map döngüsü ile (gereksiz render almadan) listelenmesi.
- `ChatBubble` & `SkeletonBubble`: Kullanıcı ve yapay zekadan gelen mesajların UI içerisinde gösterimi (Markdown destekli) ve yüklenme animasyonu.
- `WelcomeView`: Sayfa ilk yüklendiğinde gelen karşılama ve hazır soru şablonları.

## 🚀 Önemli Geliştirmeler & Performans Optimizasyonları

### 1. Performanslı Liste Yönetimi (FlashList)
Standart React Native `FlatList` yerine `@shopify/flash-list` kullanılarak memory leak engellenmiştir. Mesajların Render işlemleri anonim fonksiyonlardan (inline arrow functions) temizlenip tamamiyle `useCallback` hooklarına geçirilerek Scroll sırasında UI donmaları engellenmiştir. 

### 2. Akıcı Ağ Bağlantısı ve Stream Kontrolü
Next.js ve Gemini tarafından gelen metin blokları (Chunks), istemci tarafında UI anlık olarak kasmadan ekrana dökülür. Kullanıcı istediği an süreci durdurabilsin diye arka planda Network düzeyinde ağ isteğini anında kesen **`AbortController`** (Bağlantı İptal Sinyali) yapısı uygulanmıştır. AI tarafı gereksiz çalışmaya devam etmez.

### 3. Zustand Global Deposu & Güvenli Silme İşlemleri
Tüm sohbetler `AsyncStorage` ile cihazda saklanarak uygulamaya girip çıkıldığında sohbetlerin uçması engellenmiştir. Sohbet listesinden (Yan menü) eski sohbetleri çöp kutusuna tıklayarak sildiğinizde, uygulama otomatik olarak silinen sohbete ait belleği çöp toplayıcıya atar ve aktif pencereyi bir sonraki sohbete güvenle odaklar.

### 4. LayoutAnimation ile Yumuşak UI
Ekranda yeni elementler (mesajlar vb.) bir anda belirip göz yormasın diye Android (UIManager) ve iOS cihazlarda native olarak render gecikmesi yaşamayan **LayoutAnimation** ile akıcı ease-in/ease-out geçiş animasyonları yaratılmıştır.

### 5. Safe Area Kontrolü
Sabit piksel boşlukları (Örn `paddingTop: 50`) tamamen kaldırılarak cihazların "Dinamik Ada" ve çentik donanımlarına otomatik yönelen `useSafeAreaInsets()` kullanılmıştır. Uygulama her cihazda %100 uyumlu renderlanır.
