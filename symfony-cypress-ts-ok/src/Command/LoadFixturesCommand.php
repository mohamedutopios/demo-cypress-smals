<?php

namespace App\Command;

use App\Entity\Product;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsCommand(
    name: 'app:fixtures:load',
    description: 'Charge les données de démonstration'
)]
class LoadFixturesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
        private UserPasswordHasherInterface $hasher
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Chargement des fixtures');

        // Création des utilisateurs
        $io->section('Création des utilisateurs');

        $admin = new User();
        $admin->setEmail('admin@example.com');
        $admin->setFirstName('Admin');
        $admin->setLastName('Utopios');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($this->hasher->hashPassword($admin, 'password'));
        $this->em->persist($admin);
        $io->text('✓ Admin créé : admin@example.com / password');

        $user = new User();
        $user->setEmail('user@example.com');
        $user->setFirstName('Jean');
        $user->setLastName('Dupont');
        $user->setRoles([]);
        $user->setPassword($this->hasher->hashPassword($user, 'password'));
        $this->em->persist($user);
        $io->text('✓ User créé : user@example.com / password');

        // Création des produits
        $io->section('Création des produits');

        $products = [
            ['name' => 'MacBook Pro 14"', 'description' => 'Ordinateur portable Apple avec puce M3 Pro, 18 Go RAM, 512 Go SSD. Écran Liquid Retina XDR.', 'price' => '2499.00', 'stock' => 15, 'category' => 'electronics'],
            ['name' => 'iPhone 15 Pro', 'description' => 'Smartphone Apple avec puce A17 Pro, appareil photo 48MP, titane.', 'price' => '1229.00', 'stock' => 42, 'category' => 'electronics'],
            ['name' => 'AirPods Pro 2', 'description' => 'Écouteurs sans fil avec réduction de bruit active et audio spatial.', 'price' => '279.00', 'stock' => 100, 'category' => 'electronics'],
            ['name' => 'Pull en cachemire', 'description' => 'Pull col rond en 100% cachemire, disponible en plusieurs coloris.', 'price' => '189.00', 'stock' => 25, 'category' => 'clothing'],
            ['name' => 'Jean slim noir', 'description' => 'Jean coupe slim en denim stretch confortable.', 'price' => '79.00', 'stock' => 50, 'category' => 'clothing'],
            ['name' => 'Sneakers blanches', 'description' => 'Baskets en cuir blanc, semelle en caoutchouc.', 'price' => '129.00', 'stock' => 35, 'category' => 'clothing'],
            ['name' => 'Café arabica bio', 'description' => 'Café en grains 100% arabica issu de l\'agriculture biologique. 1kg.', 'price' => '24.90', 'stock' => 200, 'category' => 'food'],
            ['name' => 'Huile d\'olive extra vierge', 'description' => 'Huile d\'olive première pression à froid, origine Italie. 75cl.', 'price' => '18.50', 'stock' => 80, 'category' => 'food'],
            ['name' => 'Lampe de bureau LED', 'description' => 'Lampe articulée avec variateur d\'intensité et température de couleur réglable.', 'price' => '59.00', 'stock' => 40, 'category' => 'home'],
            ['name' => 'Coussin décoratif', 'description' => 'Coussin en velours 45x45cm avec garnissage moelleux.', 'price' => '29.00', 'stock' => 60, 'category' => 'home'],
            ['name' => 'Tapis de yoga', 'description' => 'Tapis antidérapant 183x61cm, épaisseur 6mm, avec sangle de transport.', 'price' => '39.00', 'stock' => 45, 'category' => 'sport'],
            ['name' => 'Haltères 10kg (paire)', 'description' => 'Paire d\'haltères en fonte avec revêtement néoprène.', 'price' => '49.00', 'stock' => 30, 'category' => 'sport'],
        ];

        foreach ($products as $data) {
            $product = new Product();
            $product->setName($data['name']);
            $product->setDescription($data['description']);
            $product->setPrice($data['price']);
            $product->setStock($data['stock']);
            $product->setCategory($data['category']);
            $product->setIsActive(true);
            $this->em->persist($product);
            $io->text('✓ Produit créé : ' . $data['name']);
        }

        $this->em->flush();

        $io->success('Fixtures chargées avec succès !');
        $io->table(
            ['Type', 'Nombre'],
            [
                ['Utilisateurs', '2'],
                ['Produits', count($products)],
            ]
        );

        return Command::SUCCESS;
    }
}
