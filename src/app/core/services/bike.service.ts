import { Injectable, signal } from '@angular/core';

export interface Bike {
  id: number;
  name: string;
  brand: string;
  category: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
}

@Injectable({
  providedIn: 'root',
})
export class BikeService {
  private bikes = signal<Bike[]>([
    {
      id: 1,
      name: 'Trailblazer Red Fire 29',
      brand: 'GTS Motion',
      category: 'Mountain Bike',
      description: 'Mountain bike aro 29 em vermelho vibrante com freio hidráulico e 12 marchas.',
      price: 3499.0,
      stock: 3,
      imageUrl: 'https://images.tcdn.com.br/img/img_prod/394779/bicicleta_gts_aro_29_freio_hidraulico_cubo_k7_cambios_1x12_marchas_e_suspensao_trava_no_guidao_gts_m_4246_variacao_13552_1_394a6ea61ef0777e8e89fa7c24921241.png',
    },
    {
      id: 2,
      name: 'Speedster Carbon Blue Ocean',
      brand: 'KGT',
      category: 'Speed / Estrada',
      description: 'Bicicleta aro 29 preta com vermelho, suspensão e freio a disco.',
      price: 2890.0,
      stock: 2,
      imageUrl: 'https://static.clube.netshoes.com.br/produtos/bicicleta-aro-29-aco-carbono-kgt-freios-disco-suspensao-21v/02/9CE-0039-002/9CE-0039-002_zoom1.jpg?ts=1777566260&ims=544x',
    },
    {
      id: 3,
      name: 'Urban Glide Yellow Volt',
      brand: 'Cross',
      category: 'BMX / Urbana',
      description: 'Bicicleta aro 20 estilo cross amarela vibrante.',
      price: 1590.0,
      stock: 4,
      imageUrl: 'https://cdn.awsli.com.br/2500x2500/1103/1103806/produto/240374650/bicicleta-aro-20-estilo-cross-amarela-tf3oo4vawi.png',
    },
    {
      id: 4,
      name: 'Gravel Explorer Green Forest',
      brand: 'GTS M1',
      category: 'Gravel / MTB',
      description: 'Bicicleta aro 29 preta com detalhes azul e verde, câmbio Shimano 21V.',
      price: 3150.0,
      stock: 5,
      imageUrl: 'https://images.tcdn.com.br/img/img_prod/394779/bicicleta_29_gts_m1_freio_a_disco_cambio_shimano_21v_advanced_2417_variacao_16429_1_caad91f9d3548349e0e72c3cb5e6b0f5_20260525113203.jpg',
    },
    {
      id: 5,
      name: 'Freeride Street Matte Black',
      brand: 'GTS M1',
      category: 'Freeride / Street',
      description: 'Bicicleta freeride aro 26 preta com detalhes coloridos, freio hidráulico e 7 marchas.',
      price: 2490.0,
      stock: 4,
      imageUrl: 'https://images.tcdn.com.br/img/img_prod/394779/bicicleta_freeride_gts_aro_26_freio_hidraulico_7_marchas_gtsm1_freeride_5125_16867_1_20260525112859_5eb1d8625254.jpg',
    },
    {
      id: 6,
      name: 'City Commuter Pure Blue',
      brand: 'KRW',
      category: 'Urbana / MTB',
      description: 'Bicicleta aro 29 em alumínio azul com 24 marchas e suspensão dianteira.',
      price: 2199.0,
      stock: 3,
      imageUrl: 'https://static.clube.netshoes.com.br/produtos/bicicleta-aro-29-krw-aluminio-24-vel-marchas-freio-a-disco-suspensao-dianteira-mountain-bike-x32/08/CGY-0302-108/CGY-0302-108_zoom1.jpg?ts=1783929703',
    },
    {
      id: 7,
      name: 'Enduro Beast Burst',
      brand: 'Trail King',
      category: 'Mountain Bike',
      description: 'Bicicleta aro 29 branca com preto projetada para trilhas de impacto.',
      price: 4990.0,
      stock: 2,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdR3nVreBe1moxxGcjMj7Bh0AtbxEXvvkVIjkzKoKPWfqDXWnP26oWpig7&s=10',
    },
    {
      id: 8,
      name: 'Classic Ride Pink Edition',
      brand: 'GTS M1',
      category: 'Feminina / Passeio',
      description: 'Bicicleta feminina aro 29 em preto com rosa, 24 marchas e amortecedor.',
      price: 2300.0,
      stock: 5,
      imageUrl: 'https://images.tcdn.com.br/img/img_prod/394779/bicicleta_feminina_gts_aro_29_freio_a_disco_cambio_gtsm1_mx8_24_marchas_e_amortecedor_gts_m1_ride_fe_1017_variacao_6300_2_cd285db44aaafcd4815fad90c5e746d4_20260525113037.jpg',
    },
    {
      id: 9,
      name: 'Aero Race Black Lightning',
      brand: 'Road King',
      category: 'Speed / Urbana',
      description: 'Bicicleta em preto com verde, freios a disco para alta velocidade.',
      price: 3850.0,
      stock: 2,
      imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoQo2zhViphHHMM5XGUASQAI6Q8S8WavTfm1HqFoZG5b4epjLdQhaEKKRR&s=10',
    },
  ]);

  getBikes() {
    return this.bikes();
  }

  getBikeById(id: number): Bike | undefined {
    return this.bikes().find((b) => b.id === id);
  }

  addBike(newBike: Omit<Bike, 'id'>) {
    const current = this.bikes();
    const nextId = current.length > 0 ? Math.max(...current.map((b) => b.id)) + 1 : 1;
    this.bikes.set([...current, { ...newBike, id: nextId }]);
  }

  updateBike(updatedBike: Bike) {
    this.bikes.update((list) =>
      list.map((b) => (b.id === updatedBike.id ? { ...updatedBike } : b))
    );
  }

  deleteBike(id: number) {
    this.bikes.update((list) => list.filter((b) => b.id !== id));
  }
}