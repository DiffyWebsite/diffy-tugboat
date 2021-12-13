<?php

namespace Drupal\diffy_try\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;

/**
 * Defines the Project entity.
 *
 * @ContentEntityType(
 *   id = "project",
 *   label = @Translation("Diffy project"),
 *   label_collection = @Translation("Diffy projects"),
 *   label_singular = @Translation("diffy project"),
 *   label_plural = @Translation("diffy projects"),
 *   label_count = @PluralTranslation(
 *     singular = "@count diffy project",
 *     plural = "@count diffy projects",
 *   ),
 *   handlers = {
 *     "form" = {
 *       "default" = "Drupal\Core\Entity\ContentEntityForm"
 *     }
 *   },
 *   base_table = "project_data",
 *   data_table = "taxonomy_term_field_data",
 *   translatable = FALSE,
 *   entity_keys = {
 *     "id" = "pid",
 *     "label" = "prod_url",
 *     "uuid" = "uuid"
 *   },
 *   links = {
 *     "canonical" = "/project/{uuid}",
 *     "create" = "/try",
 *   }
 * )
 */
class Project extends ContentEntityBase {

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type) {
    /** @var \Drupal\Core\Field\BaseFieldDefinition[] $fields */
    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['pid']->setLabel(t('Project ID'))
      ->setDescription(t('The project ID.'));

    $fields['uuid']->setDescription(t('The project UUID.'));

    $fields['prod_url'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Prod URL'))
      ->setRequired(TRUE)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'string',
      ])
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
      ])
      ->setDisplayConfigurable('form', TRUE);

    $fields['settings'] = BaseFieldDefinition::create('text_long')
      ->setLabel(t('Settings'))
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'text_default',
      ])
      ->setDisplayConfigurable('view', TRUE)
      ->setDisplayOptions('form', [
        'type' => 'text_textfield',
      ])
      ->setDisplayConfigurable('form', TRUE);

    $fields['created'] = BaseFieldDefinition::create('created')
      ->setLabel(t('Created'))
      ->setDescription(t('Time the entity was created'));

    return $fields;
  }

}
